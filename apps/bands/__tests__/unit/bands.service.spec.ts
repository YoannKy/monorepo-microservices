import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

import { DatabaseError } from '@libs/exceptions';

import { BandsService } from '../../src/bands/services/bands.service';
import { Band } from '../../src/bands/models/bands.model';

class MockedBandModel {
  find() {
    return jest.fn();
  }
  where() {
    return jest.fn();
  }
}

describe('[UNIT] Bands service', () => {
  let bandsService: BandsService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        BandsService,
        {
          provide: getModelToken(Band.name),
          useClass: MockedBandModel,
        },
      ],
    }).compile();
    bandsService = moduleRef.get<BandsService>(BandsService);
  });

  describe('list method', () => {
    it('should return a list of bands', async () => {
      const expectedList = [];
      jest.spyOn(MockedBandModel.prototype, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.resolve(expectedList)),
          } as any),
      );
      const result = await bandsService.list();

      expect(result).toEqual(expectedList);
    });

    it('should throw DatabaseError is something goes wrong', async () => {
      jest.spyOn(MockedBandModel.prototype, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.reject(new Error(''))),
          } as any),
      );
      await expect(bandsService.list()).rejects.toBeInstanceOf(DatabaseError);
    });
  });

  describe('listById method', () => {
    const params = [1];
    it('should return a list of bands', async () => {
      const expectedList = [];
      jest.spyOn(MockedBandModel.prototype, 'where').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.resolve(expectedList)),
          } as any),
      );
      const result = await bandsService.listById(params);

      expect(MockedBandModel.prototype.where).toHaveBeenCalledWith(
        'id',
        params,
      );

      expect(result).toEqual(expectedList);
    });

    it('should throw DatabaseError is something goes wrong', async () => {
      jest.spyOn(MockedBandModel.prototype, 'where').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.reject(new Error(''))),
          } as any),
      );
      await expect(bandsService.listById(params)).rejects.toBeInstanceOf(
        DatabaseError,
      );
    });
  });
});
