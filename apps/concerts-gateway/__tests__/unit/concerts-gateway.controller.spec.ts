import { Test } from '@nestjs/testing';
import { Logger, HttpException } from '@nestjs/common';

import { of, throwError } from 'rxjs';

import { ConcertsGatewayService } from '../../src/concerts-gateway/services/concerts-gateway.service';
import { ConcertsGatewayController } from '../../src/concerts-gateway/controllers/concerts-gateway.controller';

class MockedConcertsGatewayService {
  list() {
    return jest.fn();
  }
}

describe('[UNIT] ConcertsGateway controller', () => {
  let concertsGatewayService: ConcertsGatewayService;
  let concertsGatewayController: ConcertsGatewayController;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ConcertsGatewayController],
      providers: [
        {
          provide: ConcertsGatewayService,
          useClass: MockedConcertsGatewayService,
        },
      ],
    }).compile();
    concertsGatewayController = moduleRef.get<ConcertsGatewayController>(
      ConcertsGatewayController,
    );
    concertsGatewayService = moduleRef.get<ConcertsGatewayService>(
      ConcertsGatewayService,
    );
  });

  describe('list method', () => {
    it('should return a list of concerts-gateway', async (done) => {
      const params = {
        latitude: 1,
        longitude: 5,
        radius: 5,
        bandIds: [2, 5],
      };

      jest.spyOn(concertsGatewayService, 'list').mockReturnValue(of([]));

      concertsGatewayController.list(params).subscribe((result) => {
        expect(concertsGatewayService.list).toHaveBeenCalledWith(params);
        expect(result).toEqual([]);
        done();
      });
    });

    it('should return a list of concerts-gateway', async (done) => {
      const params = {
        latitude: 1,
        longitude: 5,
        radius: 5,
        bandIds: [2, 5],
      };

      const mockedError = {
        status: 400,
        message: 'oops',
      };

      jest
        .spyOn(concertsGatewayService, 'list')
        .mockReturnValue(throwError(mockedError));

      concertsGatewayController.list(params).subscribe(
        () => {
          return;
        },
        (error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toEqual(mockedError.status);
          expect(error.message).toEqual(mockedError.message);
          expect(concertsGatewayService.list).toHaveBeenCalledWith(params);
          done();
        },
      );
    });
  });
});
