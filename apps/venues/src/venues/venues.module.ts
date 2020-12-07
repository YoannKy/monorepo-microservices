import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ValidatorModule } from '@libs/validator';

import { VenuesController } from './controllers/venues.controller';
import { VenuesService } from './services/venues.service';
import { Venue, VenueSchema } from './models/venues.model';

@Module({
  imports: [
    ValidatorModule,
    MongooseModule.forFeature([{ name: Venue.name, schema: VenueSchema }]),
  ],
  controllers: [VenuesController],
  providers: [VenuesService],
})
export class VenuesModule {}
