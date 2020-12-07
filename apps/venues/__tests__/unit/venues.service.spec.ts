import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

import { DatabaseError } from '@libs/exceptions';

import { VenuesService } from '../../src/venues/services/venues.service';
import { Venue } from '../../src/venues/models/venues.model';
import { EQUATORIAL_EARTH_RADIUS } from '../../src/venues/consts/geometry.const';

class MockedVenueModel {
  find() {
    return jest.fn();
  }
  aggregate() {
    return jest.fn();
  }
}

describe('[UNIT] Venues service', () => {
  let venuesService: VenuesService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        VenuesService,
        {
          provide: getModelToken(Venue.name),
          useClass: MockedVenueModel,
        },
      ],
    }).compile();
    venuesService = moduleRef.get<VenuesService>(VenuesService);
  });

  describe('list method', () => {
    it('should return a list of venues', async () => {
      const expectedList = [];
      jest.spyOn(MockedVenueModel.prototype, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.resolve(expectedList)),
          } as any),
      );
      const result = await venuesService.list();

      expect(result).toEqual(expectedList);
    });

    it('should throw DatabaseError is something goes wrong', async () => {
      jest.spyOn(MockedVenueModel.prototype, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.reject(new Error(''))),
          } as any),
      );
      await expect(venuesService.list()).rejects.toBeInstanceOf(DatabaseError);
    });
  });

  describe('listByLocation method', () => {
    const params = {
      latitude: 1,
      longitude: 2,
      radius: 10,
    };
    it('should return a list of venues', async () => {
      const expectedList = [];

      jest.spyOn(MockedVenueModel.prototype, 'aggregate').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.resolve(expectedList)),
          } as any),
      );
      const result = await venuesService.listByLocation(params);

      expect(MockedVenueModel.prototype.aggregate).toHaveBeenCalledWith([
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
                  [params.longitude, params.latitude],
                  params.radius / EQUATORIAL_EARTH_RADIUS,
                ],
              },
            },
          },
        },
      ]);

      expect(result).toEqual(expectedList);
    });

    it('should throw DatabaseError is something goes wrong', async () => {
      jest.spyOn(MockedVenueModel.prototype, 'aggregate').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.reject(new Error(''))),
          } as any),
      );
      await expect(venuesService.listByLocation(params)).rejects.toBeInstanceOf(
        DatabaseError,
      );
    });
  });
});
