import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import { ValidatorService } from '@libs/validator';

import { VenuesService } from '../../src/venues/services/venues.service';
import { VenuesController } from '../../src/venues/controllers/venues.controller';
import { VALIDATE_PARAMS_SCHEMA } from '../../src/venues/consts/ajv.const';

class MockedVenuesService {
  list() {
    return jest.fn();
  }
  listByLocation() {
    return jest.fn();
  }
}

class MockedValidatorService {
  validate() {
    return jest.fn();
  }
}

describe('[UNIT] Venues controller', () => {
  let venuesService: VenuesService;
  let venuesController: VenuesController;
  let validatorService: ValidatorService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [VenuesController],
      providers: [
        {
          provide: VenuesService,
          useClass: MockedVenuesService,
        },
        {
          provide: ValidatorService,
          useClass: MockedValidatorService,
        },
      ],
    }).compile();
    venuesController = moduleRef.get<VenuesController>(VenuesController);
    validatorService = moduleRef.get<ValidatorService>(ValidatorService);
    venuesService = moduleRef.get<VenuesService>(VenuesService);
  });

  describe('list method', () => {
    it('should return a list of venues, no params passed', async () => {
      jest.spyOn(validatorService, 'validate').mockResolvedValue();
      jest.spyOn(venuesService, 'list').mockResolvedValue([]);

      const result = await venuesController.list({} as any);

      expect(result).toEqual([]);
      expect(validatorService.validate).toHaveBeenCalledWith({
        payload: {},
        schema: VALIDATE_PARAMS_SCHEMA,
      });
      expect(venuesService.list).toHaveBeenCalled();
    });

    it('should return a list of venues params passed', async () => {
      jest.spyOn(validatorService, 'validate').mockResolvedValue();
      jest.spyOn(venuesService, 'listByLocation').mockResolvedValue([]);

      const params = {
        longitude: 1,
        latitude: 1,
        radius: 1,
      };

      const result = await venuesController.list(params);

      expect(validatorService.validate).toHaveBeenCalledWith({
        payload: params,
        schema: VALIDATE_PARAMS_SCHEMA,
      });
      expect(result).toEqual([]);
      expect(venuesService.listByLocation).toHaveBeenCalledWith(params);
    });
  });
});
