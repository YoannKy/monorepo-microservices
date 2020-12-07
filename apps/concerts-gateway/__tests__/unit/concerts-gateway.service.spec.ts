import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { of } from 'rxjs';

import { ConcertsGatewayService } from '../../src/concerts-gateway/services/concerts-gateway.service';

describe('[UNIT] ConcertsGateway service', () => {
  const PORT_VENUES = '8887';
  const PORT_BANDS = '8888';
  const PORT_CONCERTS = '8889';
  const HOST_VENUES = '127.0.0.1';
  const HOST_BANDS = '127.0.0.1';
  const HOST_CONCERTS = '127.0.0.1';
  const send = jest.fn();
  const bands = [
    {
      id: 2,
      name: 'band',
    },
  ];
  const concerts = [
    {
      date: 1596632517,
      bandId: 2,
      venueId: 3,
    },
  ];
  const venues = [
    {
      id: 3,
      latitude: 5,
      longitude: 4,
      name: 'venue',
    },
  ];

  const expectedConcertsGateway = [
    {
      date: concerts[0].date,
      band: bands[0].name,
      latitude: venues[0].latitude,
      longitude: venues[0].longitude,
      location: venues[0].name,
    },
  ];

  jest.spyOn(ClientProxyFactory, 'create').mockReturnValue({ send } as any);

  send
    .mockReturnValueOnce(of(bands))
    .mockReturnValueOnce(of(concerts))
    .mockReturnValueOnce(of(venues));

  let concertsGatewayService: ConcertsGatewayService;

  beforeEach(async () => {
    process.env.MICROSERVICE_PORT_VENUES = PORT_VENUES;
    process.env.MICROSERVICE_PORT_CONCERTS = PORT_CONCERTS;
    process.env.MICROSERVICE_PORT_BANDS = PORT_BANDS;
    process.env.MONGO_HOST_VENUES = HOST_VENUES;
    process.env.MONGO_HOST_BANDS = HOST_BANDS;
    process.env.MONGO_HOST_CONCERTS = HOST_CONCERTS;

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ConcertsGatewayService],
    }).compile();
    concertsGatewayService = moduleRef.get<ConcertsGatewayService>(
      ConcertsGatewayService,
    );
  });

  afterEach(() => {
    delete process.env.MICROSERVICE_PORT_VENUES;
    delete process.env.MICROSERVICE_PORT_BANDS;
    delete process.env.MICROSERVICE_PORT_CONCERTS;
    delete process.env.MONGO_HOST_VENUES;
    delete process.env.MONGO_HOST_BANDS;
    delete process.env.MONGO_HOST_CONCERTS;
  });

  describe('list method', () => {
    it('should return a list of concerts-gateway', async (done) => {
      const params = {
        longitude: 1,
        latitude: 2,
        bandIds: [1, 2],
        radius: 1,
      };

      concertsGatewayService.list(params).subscribe((result) => {
        expect(result).toEqual(expectedConcertsGateway);

        expect(ClientProxyFactory.create).toHaveBeenNthCalledWith(1, {
          transport: Transport.TCP,
          options: {
            host: HOST_BANDS,
            port: +PORT_BANDS,
          },
        });

        expect(ClientProxyFactory.create).toHaveBeenNthCalledWith(2, {
          transport: Transport.TCP,
          options: {
            host: HOST_CONCERTS,
            port: +PORT_CONCERTS,
          },
        });

        expect(ClientProxyFactory.create).toHaveBeenNthCalledWith(3, {
          transport: Transport.TCP,
          options: {
            host: HOST_VENUES,
            port: +PORT_VENUES,
          },
        });

        expect(send).toHaveBeenNthCalledWith(1, 'list', {
          bandIds: params.bandIds,
        });
        expect(send).toHaveBeenNthCalledWith(2, 'list', {});
        expect(send).toHaveBeenNthCalledWith(3, 'list', {
          longitude: params.longitude,
          latitude: params.latitude,
          radius: params.radius,
        });

        done();
      });
    });
  });
});
