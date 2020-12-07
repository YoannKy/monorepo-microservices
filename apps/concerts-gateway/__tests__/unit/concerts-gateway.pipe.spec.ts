import { Test } from '@nestjs/testing';
import { Logger, HttpException } from '@nestjs/common';

import { TransformParamsPipe } from '../../src/concerts-gateway/pipes/concerts-gateway.pipe';

describe('[UNIT] ConcertsGateway pipe', () => {
  let concertsGatewayPipe: TransformParamsPipe;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [TransformParamsPipe],
    }).compile();
    concertsGatewayPipe = moduleRef.get<TransformParamsPipe>(
      TransformParamsPipe,
    );
  });

  describe('tranform method', () => {
    it('should transform the payload values into numbers', async () => {
      const params = {
        longitude: '1',
        latitude: '2',
        bandIds: ['1', '2'],
        radius: '1',
      };

      const expectedParams = {
        longitude: 1,
        latitude: 2,
        bandIds: [1, 2],
        radius: 1,
      };

      const result = concertsGatewayPipe.transform(params as any);
      expect(result).toEqual(expectedParams);
    });

    it('should transform the payload values into numbers, bandIds is not an array', async () => {
      const params = {
        longitude: '1',
        latitude: '2',
        bandIds: '1',
        radius: '1',
      };

      const expectedParams = {
        longitude: 1,
        latitude: 2,
        bandIds: [1],
        radius: 1,
      };

      const result = concertsGatewayPipe.transform(params as any);
      expect(result).toEqual(expectedParams);
    });

    it('should transform the payload values into numbers, bandIds is not set', async () => {
      const params = {
        longitude: '1',
        latitude: '2',
        radius: '1',
      };

      const expectedParams = {
        longitude: 1,
        latitude: 2,
        radius: 1,
      };

      const result = concertsGatewayPipe.transform(params as any);
      expect(result).toEqual(expectedParams);
    });

    it('should transform the payload values into numbers, bandIds have empty strings', async () => {
      const params = {
        longitude: '1',
        latitude: '2',
        radius: '1',
        bandIds: ['', '', 1],
      };

      const expectedParams = {
        longitude: 1,
        latitude: 2,
        bandIds: ['', '', 1],
        radius: 1,
      };

      const result = concertsGatewayPipe.transform(params as any);
      expect(result).toEqual(expectedParams);
    });

    it('should transform the payload values into numbers, bandIds not passed', async () => {
      const params = {
        longitude: '1',
        latitude: '2',
        radius: '1',
      };

      const expectedParams = {
        longitude: 1,
        latitude: 2,
        bandIds: undefined,
        radius: 1,
      };

      const result = concertsGatewayPipe.transform(params as any);
      expect(result).toEqual(expectedParams);
    });

    it('should transform the payload values into numbers, longitude, latitude and radius not passed', async () => {
      const params = {
        bandIds: ['1', '2'],
      };

      const expectedParams = {
        bandIds: [1, 2],
      };

      const result = concertsGatewayPipe.transform(params as any);
      expect(result).toEqual(expectedParams);
    });

    it('should throw if payload is empty', async () => {
      const params = {};
      try {
        concertsGatewayPipe.transform(params as any);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
