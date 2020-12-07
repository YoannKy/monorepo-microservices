import { Test } from '@nestjs/testing';
import { Logger, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

import bands from '@json/bands/bands.test';

import { BandsService } from '../../src/bands/services/bands.service';
import { Band, BandSchema } from '../../src/bands/models/bands.model';

describe('[INTEGRATION] Bands service', () => {
  let bandsService: BandsService;
  let app: INestApplication;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();

    const {
      MONGO_USER_BANDS: user,
      MONGO_PASSWORD_BANDS: pwd,
      MONGO_HOST_BANDS: host,
      MONGO_PORT_BANDS: port,
      MONGO_DATABASE_BANDS: database,
    } = process.env;

    const URL = `mongodb://${user}:${pwd}@${host}:${port}/${database}`;
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: Band.name, schema: BandSchema }]),
        MongooseModule.forRoot(URL, { useNewUrlParser: true }),
      ],
      providers: [BandsService],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    bandsService = moduleRef.get<BandsService>(BandsService);
  });

  afterEach(async () => await app.close());

  describe('list method', () => {
    it('should return a list of bands', async () => {
      const result = await bandsService.list();
      expect(result).toMatchObject(bands);
    });
  });

  describe('listById method', () => {
    it('should return a list of bands', async () => {
      const [{ id }] = bands;
      const result = await bandsService.listById([id]);
      expect(result).toMatchObject([bands[0]]);
    });
  });
});
