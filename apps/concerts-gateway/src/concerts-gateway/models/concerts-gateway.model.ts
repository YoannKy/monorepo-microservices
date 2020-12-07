import { ApiProperty } from '@nestjs/swagger';

import { IVenue } from '@libs/venue-model';
import { IBand } from '@libs/band-model';
import { IConcert } from '@libs/concert-model';

type PartialBand = { band: IBand['name'] };
type PartialConcert = Pick<IConcert, 'date'>;
type PartialVenue = Pick<IVenue, 'longitude' | 'latitude'> & {
  location: IVenue['name'];
};

export class Concert implements PartialBand, PartialConcert, PartialVenue {
  @ApiProperty({
    example: 'red hot chili peppers',
    description: 'The name of the band',
  })
  band: string;

  @ApiProperty({ example: 'Paris', description: 'The location of the concert' })
  location: string;

  @ApiProperty({ example: 48.8534, description: 'The latitude of the concert' })
  latitude: number;

  @ApiProperty({ example: 2.3488, description: 'The longitude of the concert' })
  longitude: number;

  @ApiProperty({ example: 1402009787, description: 'The date of the concert' })
  date: number;
}
