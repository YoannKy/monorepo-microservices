import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { VenueQueryParameters } from '@libs/venue-model';
import { DatabaseError } from '@libs/exceptions';

import { Venue, VenueDocument } from '../models/venues.model';
import { EQUATORIAL_EARTH_RADIUS } from '../consts/geometry.const';

@Injectable()
export class VenuesService {
  private logger: Logger;
  constructor(
    @InjectModel(Venue.name) private venueModel: Model<VenueDocument>,
  ) {
    this.logger = new Logger('VenuesService');
  }
  /**
   * Return a list of venues
   * @returns {Venue[]}
   */
  async list(): Promise<VenueDocument[]> {
    try {
      return await this.venueModel.find().exec();
    } catch (error) {
      this.logger.error(error);
      throw new DatabaseError();
    }
  }

  /**
   * Return a list of venues within the circle described by the coordinate [logngitude, latitude] with the given radius
   * @param {number} params.longitude - The longitude
   * @param {number} params.latitude - The latitude
   * @param {number} params.radius - The radius
   * @returns {Promise<Venue[]>}
   */
  async listByLocation({
    longitude,
    latitude,
    radius,
  }: VenueQueryParameters): Promise<VenueDocument[]> {
    try {
      return await this.venueModel
        .aggregate([
          {
            $addFields: {
              location: {
                type: 'Point',
                coordinates: ['$longitude', '$latitude'],
              },
            },
          },
          {
            $match: {
              location: {
                $geoWithin: {
                  $centerSphere: [
                    [longitude, latitude],
                    radius / EQUATORIAL_EARTH_RADIUS,
                  ],
                },
              },
            },
          },
        ])
        .exec();
    } catch (error) {
      this.logger.error(error);
      throw new DatabaseError();
    }
  }
}
