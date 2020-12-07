import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import { ValidatorService } from '@libs/validator';

import { BandsService } from '../../src/bands/services/bands.service';
import { BandsController } from '../../src/bands/controllers/bands.controller';
import { VALIDATE_PARAMS_SCHEMA } from '../../src/bands/consts/ajv.const';

class MockedBandsService {
  list() {
    return jest.fn();
  }
  listById() {
    return jest.fn();
  }
}

class MockedValidatorService {
  validate() {
    return jest.fn();
  }
}

describe('[UNIT] Bands controller', () => {
  let bandsService: BandsService;
  let bandsController: BandsController;
  let validatorService: ValidatorService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [BandsController],
      providers: [
        {
          provide: BandsService,
          useClass: MockedBandsService,
        },
        {
          provide: ValidatorService,
          useClass: MockedValidatorService,
        },
      ],
    }).compile();
    bandsController = moduleRef.get<BandsController>(BandsController);
    validatorService = moduleRef.get<ValidatorService>(ValidatorService);
    bandsService = moduleRef.get<BandsService>(BandsService);
  });

  describe('list method', () => {
    it('should return a list of bands, no params passed', async () => {
      jest.spyOn(validatorService, 'validate').mockResolvedValue();
      jest.spyOn(bandsService, 'list').mockResolvedValue([]);

      const result = await bandsController.list();

      expect(result).toEqual([]);
      expect(validatorService.validate).toHaveBeenCalledWith({
        payload: undefined,
        schema: VALIDATE_PARAMS_SCHEMA,
      });
      expect(bandsService.list).toHaveBeenCalled();
    });

    it('should return a list of bands params passed', async () => {
      jest.spyOn(validatorService, 'validate').mockResolvedValue();
      jest.spyOn(bandsService, 'listById').mockResolvedValue([]);

      const params = { bandIds: [1] };

      const result = await bandsController.list(params);

      expect(validatorService.validate).toHaveBeenCalledWith({
        payload: params,
        schema: VALIDATE_PARAMS_SCHEMA,
      });
      expect(result).toEqual([]);
      expect(bandsService.listById).toHaveBeenCalledWith(params.bandIds);
    });
  });
});
