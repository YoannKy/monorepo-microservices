import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IConcert } from '@libs/concert-model';

export type ConcertDocument = Concert & Document;

@Schema()
export class Concert implements IConcert {
  @Prop()
  venueId: number;

  @Prop()
  bandId: number;

  @Prop()
  date: number;
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
