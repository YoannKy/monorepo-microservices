import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { BandsModule } from './bands/bands.module';

const {
  MONGO_USER_BANDS: user,
  MONGO_PASSWORD_BANDS: pwd,
  MONGO_HOST_BANDS: host,
  MONGO_PORT_BANDS: port,
  MONGO_DATABASE_BANDS: database,
} = process.env;

const URL = `mongodb://${user}:${pwd}@${host}:${port}/${database}`;

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(URL), BandsModule],
})
export class AppModule {}
