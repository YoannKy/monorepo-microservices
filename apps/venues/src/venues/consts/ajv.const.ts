export const VALIDATE_PARAMS_SCHEMA = {
  $async: true,
  type: 'object',
  oneOf: [
    {
      properties: {
        longitude: {
          type: 'number',
          maximum: 180,
          minimum: -180,
          errorMessage: {
            type: 'longitude must be a number (float allowed)',
          },
        },
        latitude: {
          type: 'number',
          maximum: 90,
          minimum: -90,
          errorMessage: {
            type: 'latitude must be a number (float allowed)',
          },
        },
        radius: {
          type: 'number',
          minimum: 0,
          errorMessage: {
            type: 'radius must be a number in km',
            minimum: 'radius cannot be lower than 0',
          },
        },
      },
      required: ['radius', 'latitude', 'longitude'],
      additionalItems: false,
    },
    {
      maxProperties: 0,
    },
  ],
};
