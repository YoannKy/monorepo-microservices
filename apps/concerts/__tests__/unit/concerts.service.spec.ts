import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

import { DatabaseError } from '@libs/exceptions';

import { ConcertsService } from '../../src/concerts/services/concerts.service';
import { Concert } from '../../src/concerts/models/concerts.model';

class MockedConcertModel {
  find() {
    return jest.fn();
  }
  aggregate() {
    return jest.fn();
  }
}

describe('[UNIT] Concerts service', () => {
  let concertsService: ConcertsService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getModelToken(Concert.name),
          useClass: MockedConcertModel,
        },
      ],
    }).compile();
    concertsService = moduleRef.get<ConcertsService>(ConcertsService);
  });

  describe('list method', () => {
    it('should return a list of concerts', async () => {
      const expectedList = [];
      jest.spyOn(MockedConcertModel.prototype, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn(() => ({
              exec: () => Promise.resolve(expectedList),
            })),
          } as any),
      );
      const result = await concertsService.list();

      expect(result).toEqual(expectedList);
    });

    it('should throw DatabaseError is something goes wrong', async () => {
      jest.spyOn(MockedConcertModel.prototype, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn(() => Promise.reject(new Error(''))),
          } as any),
      );
      await expect(concertsService.list()).rejects.toBeInstanceOf(
        DatabaseError,
      );
    });
  });
});
