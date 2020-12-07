import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import { ValidatorService } from '../../src/services/validator.service';

describe('[UNIT] validate method', () => {
  let validatorService: ValidatorService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ValidatorService],
    }).compile();
    validatorService = moduleRef.get<ValidatorService>(ValidatorService);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
  });

  describe('validate', () => {
    const SCHEMA = {
      $async: true,
      type: 'object',
      properties: {
        id: {
          type: 'number',
          errorMessage: {
            type: 'id must be a number',
          },
        },
      },
      required: ['id'],
    };

    it('should validate the payload', async () => {
      await expect(
        validatorService.validate({
          schema: SCHEMA,
          payload: { id: 1 },
        }),
      ).resolves.not.toThrow();
    });

    it('should throw an error because id is not a number', async () => {
      try {
        await validatorService.validate({
          schema: SCHEMA,
          payload: { id: '1' },
        });
      } catch (error) {
        expect(JSON.parse(error.message)).toEqual({
          id: {
            message: 'id must be a number',
          },
        });
      }
    });

    it('should throw an error because id is required', async () => {
      try {
        await validatorService.validate({
          schema: SCHEMA,
          payload: {},
        });
      } catch (error) {
        expect(JSON.parse(error.message)).toEqual({
          id: {
            message: "should have required property 'id'",
          },
        });
      }
    });

    it('should throw an error because at least one schema must be respected', async () => {
      try {
        await validatorService.validate({
          schema: {
            $async: true,
            type: 'object',
            oneOf: [
              {
                properties: {
                  id: {
                    type: 'number',
                    errorMessage: {
                      type: 'id must be a number',
                    },
                  },
                  name: {
                    type: 'string',
                    errorMessage: {
                      type: 'name must be a string',
                    },
                  },
                },
                required: ['id', 'name'],

                additionalItems: false,
              },
              {
                maxProperties: 0,
              },
            ],
          },
          payload: {
            id: 1,
          },
        });
      } catch (error) {
        expect(JSON.parse(error.message)).toEqual({
          name: {
            message: "should have required property 'name'",
          },
        });
      }
    });
  });
});
