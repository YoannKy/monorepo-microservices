import { Injectable, Logger } from '@nestjs/common';

import { AjvUknownError, BadParamValidatorError } from '@libs/exceptions';

import Ajv from 'ajv';
import ajvError from 'ajv-errors';

interface ValidationError {
  [key: string]: {
    message: string;
    code: string;
  };
}

const KEYWORDS_TO_HIDE = ['oneOf', 'maxProperties'];

@Injectable()
export class ValidatorService {
  private ajv: Ajv.Ajv;
  private logger: Logger;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      format: 'full',
      jsonPointers: true,
    });
    ajvError(this.ajv);
    this.logger = new Logger('Libs validator service');
  }

  /**
   * Format ajv errors to a standard format
   * @param{Ajv.ValidationError[]} errors - The errors generated by ajv
   * @returns {ValidationError}
   */
  static formatErrors(errors: Ajv.ErrorObject[]): ValidationError {
    return errors.reduce((errorAcc, { message, dataPath, keyword, params }) => {
      if (KEYWORDS_TO_HIDE.includes(keyword)) {
        return errorAcc;
      }

      if (keyword === 'required') {
        errorAcc[(params as Ajv.DependenciesParams).missingProperty] = {
          message,
        };
      } else {
        const key = dataPath.replace('/', '');
        errorAcc[key] = { message };
      }
      return errorAcc;
    }, {});
  }

  /**
   * Validate a payload based on a provided schema
   * @param {any} params.payload - The payload to validate
   * @param {any} params.schema - The schema used for validation
   * @throws AjvUknownError - if ajv throws an error uncorrelated to the inputs' validation
   * @throws BadParamValidatorError - if validation failed
   */
  async validate({ payload, schema }: { payload: any; schema: any }) {
    this.logger.log({
      info: 'validating inputs',
      payload,
      schema,
    });
    let validate: Ajv.ValidateFunction;

    try {
      validate = this.ajv.compile(schema);
    } catch (error) {
      this.logger.error(error);
      throw new AjvUknownError();
    }

    try {
      await validate(payload);
    } catch (ajvValidateError) {
      this.logger.error(ajvValidateError);
      if (!(ajvValidateError instanceof Ajv.ValidationError)) {
        throw new AjvUknownError();
      }
      throw new BadParamValidatorError(
        JSON.stringify(ValidatorService.formatErrors(ajvValidateError.errors)),
      );
    }
  }
}