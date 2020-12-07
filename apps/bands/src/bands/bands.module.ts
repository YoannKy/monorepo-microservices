import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ValidatorModule } from '@libs/validator';

import { BandsController } from './controllers/bands.controller';
import { BandsService } from './services/bands.service';
import { Band, BandSchema } from './models/bands.model';

@Module({
  imports: [
    ValidatorModule,
    MongooseModule.forFeature([{ name: Band.name, schema: BandSchema }]),
  ],
  controllers: [BandsController],
  providers: [BandsService],
})
export class BandsModule {}
