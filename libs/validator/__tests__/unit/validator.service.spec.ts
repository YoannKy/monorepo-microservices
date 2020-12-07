import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import Ajv from 'ajv';
import { mocked } from 'ts-jest/utils';

import { AjvUknownError } from '@libs/exceptions';

import { ValidatorService } from '../../src/services/validator.service';

jest.mock('ajv');
jest.mock('ajv-errors');

describe('validator service', () => {
  const validate = jest.fn();
  const mockedAjv = mocked(Ajv, true);
  let validatorService: ValidatorService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ValidatorService],
    }).compile();
    validatorService = moduleRef.get<ValidatorService>(ValidatorService);
  });

  describe('[UNIT] validate method', () => {
    const EXPECTED_COMPILE_SCHEMA = {};
    it('should validate the payload', async () => {
      validate.mockResolvedValue({});
      mockedAjv.prototype.compile.mockImplementation(() => validate);
      await validatorService.validate({
        schema: EXPECTED_COMPILE_SCHEMA,
        payload: {},
      });

      expect(validate).toHaveBeenCalledWith(EXPECTED_COMPILE_SCHEMA);
    });

    it('should throw an error if inputs are invalide', async () => {
      validate.mockResolvedValue({});
      mockedAjv.prototype.compile.mockImplementation(() => validate);
      await validatorService.validate({
        schema: EXPECTED_COMPILE_SCHEMA,
        payload: {},
      });
      expect(validate).toHaveBeenCalledWith(EXPECTED_COMPILE_SCHEMA);
    });

    it('should throw AjvUknownError if compile failed', async () => {
      Ajv.prototype.compile.mockImplementation(() => {
        throw new Error('');
      });

      await expect(
        validatorService.validate({
          schema: EXPECTED_COMPILE_SCHEMA,
          payload: {},
        }),
      ).rejects.toBeInstanceOf(AjvUknownError);

      expect(Ajv.prototype.compile).toHaveBeenCalledWith(
        EXPECTED_COMPILE_SCHEMA,
      );

      expect(validate).not.toHaveBeenCalled();
    });

    it('should throw AjvUknownError if validate failed', async () => {
      validate.mockRejectedValue(new Error(''));
      Ajv.prototype.compile.mockImplementation(() => validate);

      await expect(
        validatorService.validate({
          schema: EXPECTED_COMPILE_SCHEMA,
          payload: {},
        }),
      ).rejects.toBeInstanceOf(AjvUknownError);

      expect(Ajv.prototype.compile).toHaveBeenCalledWith(
        EXPECTED_COMPILE_SCHEMA,
      );

      expect(Ajv.prototype.compile).toHaveBeenCalledWith(
        EXPECTED_COMPILE_SCHEMA,
      );
    });
  });
});
