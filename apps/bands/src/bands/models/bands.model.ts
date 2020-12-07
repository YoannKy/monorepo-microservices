import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { IBand } from '@libs/band-model';

export type BandDocument = Band & Document;

@Schema()
export class Band implements IBand {
  @Prop()
  id: number;

  @Prop()
  name: string;
}

export const BandSchema = SchemaFactory.createForClass(Band);
