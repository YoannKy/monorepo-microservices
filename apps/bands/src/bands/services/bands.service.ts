import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { BandQueryParameters } from '@libs/band-model';
import { DatabaseError } from '@libs/exceptions';

import { Band, BandDocument } from '../models/bands.model';

@Injectable()
export class BandsService {
  private logger: Logger;

  constructor(@InjectModel(Band.name) private bandModel: Model<BandDocument>) {
    this.logger = new Logger('BandsService');
  }

  /**
   * Return a list of bands
   * @returns {Promise<Band[]>}
   */
  async list(): Promise<BandDocument[]> {
    try {
      return await this.bandModel.find().exec();
    } catch (error) {
      this.logger.error(error);
      throw new DatabaseError();
    }
  }

  /**
   * Return a list of bands based on the band ids
   * @param {number[] | number} params.bandIds - The band ids
   * @returns {Promise<Band[]>}
   */
  async listById(
    bandIds: BandQueryParameters['bandIds'],
  ): Promise<BandDocument[]> {
    try {
      return await this.bandModel.where('id', bandIds).exec();
    } catch (error) {
      this.logger.error(error);
      throw new DatabaseError();
    }
  }
}
