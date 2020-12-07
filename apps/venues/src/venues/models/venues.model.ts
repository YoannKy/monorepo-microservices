import { Document, Schema } from 'mongoose';

import { IVenue } from '@libs/venue-model';

export type VenueDocument = Venue & Document;

export class Venue implements IVenue {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export const VenueSchema = new Schema({
  id: Number,
  name: String,
  latitude: Number,
  longitude: Number,
  location: {
    type: { type: String },
    coordinates: { type: Array },
  },
});

VenueSchema.index({ location: '2dsphere' });
