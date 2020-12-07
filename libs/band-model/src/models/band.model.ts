export interface IBand {
  id: number;
  name: string;
}

export interface BandQueryParameters {
  bandIds: number | number[];
}
