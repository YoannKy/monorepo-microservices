import { Test } from '@nestjs/testing';
import { Logger, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

import concerts from '@json/concerts/concerts.test';

import { ConcertsService } from '../../src/concerts/services/concerts.service';
import {
  Concert,
  ConcertSchema,
} from '../../src/concerts/models/concerts.model';

describe('[INTEGRATION] Concerts service', () => {
  let concertsService: ConcertsService;
  let app: INestApplication;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => jest.fn());
    jest.clearAllMocks();

    const {
      MONGO_USER_CONCERTS: user,
      MONGO_PASSWORD_CONCERTS: pwd,
      MONGO_HOST_CONCERTS: host,
      MONGO_PORT_CONCERTS: port,
      MONGO_DATABASE_CONCERTS: database,
    } = process.env;

    const URL = `mongodb://${user}:${pwd}@${host}:${port}/${database}`;
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Concert.name, schema: ConcertSchema },
        ]),
        MongooseModule.forRoot(URL, { useNewUrlParser: true }),
      ],
      providers: [ConcertsService],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    concertsService = moduleRef.get<ConcertsService>(ConcertsService);
  });

  afterEach(async () => await app.close());

  describe('list method', () => {
    it('should return a list of concerts', async () => {
      const result = await concertsService.list();
      expect(result).toMatchObject(concerts);
    });
  });
});
