import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
  BadParameterExceptionFilter,
  UnknownExceptionFilter,
} from '@libs/exceptions';
import { ValidatorService } from '@libs/validator';
import { VenueQueryParameters } from '@libs/venue-model';

import { VenuesService } from '../services/venues.service';
import { VALIDATE_PARAMS_SCHEMA } from '../consts/ajv.const';

@Controller()
@UseFilters(BadParameterExceptionFilter, UnknownExceptionFilter)
export class VenuesController {
  constructor(
    private venuesService: VenuesService,
    private validatorService: ValidatorService,
  ) {}

  @MessagePattern('list')
  /**
   * Validate the payload and return a list of venues
   * @param {number} params.longitude - The longitude
   * @param {number} params.latitude - The latitude
   * @param {number} params.radius - The radius
   * @returns {Promise<Venue[]>}
   * @throws AjvUknownError - if ajv throws an error uncorrelated to the inputs' validation
   * @throws BadParamValidatorError - if validation failed
   */
  async list(payload?: VenueQueryParameters) {
    await this.validatorService.validate({
      payload,
      schema: VALIDATE_PARAMS_SCHEMA,
    });

    if (!payload || !Object.keys(payload).length) {
      return this.venuesService.list();
    }

    return this.venuesService.listByLocation(payload);
  }
}
