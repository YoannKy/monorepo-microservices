import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { VenuesModule } from './venues/venues.module';

const {
  MONGO_USER_VENUES: user,
  MONGO_PASSWORD_VENUES: pwd,
  MONGO_HOST_VENUES: host,
  MONGO_PORT_VENUES: port,
  MONGO_DATABASE_VENUES: database,
} = process.env;

const URL = `mongodb://${user}:${pwd}@${host}:${port}/${database}`;

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(URL, { useNewUrlParser: true }),
    VenuesModule,
  ],
})
export class AppModule {}
