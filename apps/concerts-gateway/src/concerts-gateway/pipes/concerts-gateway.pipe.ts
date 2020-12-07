import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { QueryParamDto } from '../dto/concerts-gateway.dto';

@Injectable()
export class TransformParamsPipe implements PipeTransform<QueryParamDto> {
  /**
   * Parse and do a basic requirement validation of the payload
   * because at least one of the 2 couples are required bandIds or longitude|latitude|radius
   * @param {number[] | number} params.bandIds - The band ids
   * @param {number} params.longitude - The longitude
   * @param {number} params.latitude - The latitude
   * @param {number} params.radius - The radius
   * @returns {Observable<Concert[]>}
   */
  transform(params: QueryParamDto): QueryParamDto {
    if (Object.values(params).every((value) => !value)) {
      throw new HttpException(
        'You must either filter by bandsIds or longitude latitude bandIds',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      longitude: params.longitude ? +params.longitude : undefined,
      latitude: params.latitude ? +params.latitude : undefined,
      radius: params.radius ? +params.radius : undefined,
      bandIds: this.mapBandIds(params.bandIds),
    };
  }

  /**
   * Format bandIds parameter, and cast to number each values when possible, empty strings are passed without cast
   * @param {number[] | number} params.bandIds - The band ids
   * @returns {number[] | undefined}
   */
  private mapBandIds(unformattedBandIds: number | number[]): number[] | undefined {
    if (typeof unformattedBandIds === 'undefined') {
      return undefined;
    }

    const bandIds = Array.isArray(unformattedBandIds)
      ? unformattedBandIds
      : [unformattedBandIds];

    return bandIds.reduce((acc, bandId) => {
      if (bandId.toString() === '') {
        acc.push(bandId);
      } else {
        acc.push(+bandId);
      }
      return acc;
    }, []);
  }
}
