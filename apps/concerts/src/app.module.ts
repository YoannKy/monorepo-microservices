import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { ConcertsModule } from './concerts/concerts.module';

const {
  MONGO_USER_CONCERTS: user,
  MONGO_PASSWORD_CONCERTS: pwd,
  MONGO_HOST_CONCERTS: host,
  MONGO_PORT_CONCERTS: port,
  MONGO_DATABASE_CONCERTS: database,
} = process.env;

const URL = `mongodb://${user}:${pwd}@${host}:${port}/${database}`;

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(URL, { useNewUrlParser: true }),
    ConcertsModule,
  ],
})
export class AppModule {}
