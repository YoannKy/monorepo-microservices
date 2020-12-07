import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import { ConcertsService } from '../../src/concerts/services/concerts.service';
import { ConcertsController } from '../../src/concerts/controllers/concerts.controller';

class MockedConcertsService {
  list() {
    return jest.fn();
  }
  listByLocation() {
    return jest.fn();
  }
}

describe('[UNIT] Concerts controller', () => {
  let concertsService: ConcertsService;
  let concertsController: ConcertsController;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useClass: MockedConcertsService,
        },
      ],
    }).compile();
    concertsController = moduleRef.get<ConcertsController>(ConcertsController);
    concertsService = moduleRef.get<ConcertsService>(ConcertsService);
  });

  describe('list method', () => {
    it('should return a list of concerts, no params passed', async () => {
      jest.spyOn(concertsService, 'list').mockResolvedValue([]);

      const result = await concertsController.list();

      expect(result).toEqual([]);

      expect(concertsService.list).toHaveBeenCalled();
    });
  });
});
