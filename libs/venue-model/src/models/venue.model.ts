export interface IVenue {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export interface VenueQueryParameters {
  longitude: number;
  latitude: number;
  radius: number;
}
