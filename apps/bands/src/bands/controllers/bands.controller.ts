import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
  BadParameterExceptionFilter,
  UnknownExceptionFilter,
} from '@libs/exceptions';
import { ValidatorService } from '@libs/validator';
import { BandQueryParameters } from '@libs/band-model';

import { BandsService } from '../services/bands.service';
import { VALIDATE_PARAMS_SCHEMA } from '../consts/ajv.const';

@Controller()
@UseFilters(BadParameterExceptionFilter, UnknownExceptionFilter)
export class BandsController {
  constructor(
    private bandService: BandsService,
    private validatorService: ValidatorService,
  ) {}

  @MessagePattern('list')
  /**
   * Validate the payload and return a list of bands
   * @param {number[] | number} params.bandIds - The band ids
   * @returns {Promise<Band[]>}
   * @throws AjvUknownError - if ajv throws an error uncorrelated to the inputs' validation
   * @throws BadParamValidatorError - if validation failed
   */
  async list(payload?: BandQueryParameters) {
    await this.validatorService.validate({
      payload,
      schema: VALIDATE_PARAMS_SCHEMA,
    });

    if (
      (Array.isArray(payload?.bandIds) && !payload.bandIds.length) ||
      !payload?.bandIds
    ) {
      return this.bandService.list();
    }

    return this.bandService.listById(payload.bandIds);
  }
}
