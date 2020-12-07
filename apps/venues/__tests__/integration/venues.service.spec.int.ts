import { Test } from '@nestjs/testing';
import { Logger, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

import venues from '@json/venues/venues.test';

import { VenuesService } from '../../src/venues/services/venues.service';
import { Venue, VenueSchema } from '../../src/venues/models/venues.model';

describe('[INTEGRATION] Venues service', () => {
  let venuesService: VenuesService;
  let app: INestApplication;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();

    const {
      MONGO_USER_VENUES: user,
      MONGO_PASSWORD_VENUES: pwd,
      MONGO_HOST_VENUES: host,
      MONGO_PORT_VENUES: port,
      MONGO_DATABASE_VENUES: database,
    } = process.env;

    const URL = `mongodb://${user}:${pwd}@${host}:${port}/${database}`;
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: Venue.name, schema: VenueSchema }]),
        MongooseModule.forRoot(URL, { useNewUrlParser: true }),
      ],
      providers: [VenuesService],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    venuesService = moduleRef.get<VenuesService>(VenuesService);
  });

  afterEach(async () => await app.close());

  describe('list method', () => {
    it('should return a list of venues', async () => {
      const result = await venuesService.list();
      expect(result).toMatchObject(venues);
    });
  });

  describe('listByLocation method', () => {
    it('should return a list of venues', async () => {
      const [{ latitude, longitude }] = venues;
      const result = await venuesService.listByLocation({
        latitude,
        longitude,
        radius: 1,
      });
      expect(result).toMatchObject([venues[0]]);
    });
  });
});
