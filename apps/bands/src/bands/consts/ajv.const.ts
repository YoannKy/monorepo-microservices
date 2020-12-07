export const VALIDATE_PARAMS_SCHEMA = {
  $async: true,
  type: 'object',
  oneOf: [
    {
      properties: {
        bandIds: {
          type: 'array',
          minItems: 1,
          items: { type: 'integer' },
          errorMessage: {
            type: 'BandIds must be an array of number',
          },
        },
      },
      required: ['bandIds'],
      additionalItems: false,
    },
    {
      maxProperties: 0,
    },
  ],
};
