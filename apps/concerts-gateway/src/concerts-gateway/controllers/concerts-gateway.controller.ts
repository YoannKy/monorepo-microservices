import { Controller, Get, Query, HttpException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MicroServiceError } from '@libs/exceptions';

import { ConcertsGatewayService } from '../services/concerts-gateway.service';
import { QueryParamDto } from '../dto/concerts-gateway.dto';
import { TransformParamsPipe } from '../pipes/concerts-gateway.pipe';
import { Concert } from '../models/concerts-gateway.model';

@Controller('concerts')
export class ConcertsGatewayController {
  constructor(private concertsGatewayService: ConcertsGatewayService) {}

  @Get()
  @ApiQuery({
    required: false,
    name: 'bandIds',
  })
  @ApiQuery({
    required: false,
    name: 'latitude',
  })
  @ApiQuery({
    required: false,
    name: 'longitude',
  })
  @ApiQuery({
    required: false,
    name: 'radius',
  })
  @ApiOperation({ summary: 'List concerts sorted by descending date' })
  @ApiResponse({
    status: 200,
    description: 'concerts successfully fetched',
    type: Concert,
  })
  @ApiResponse({ status: 400, description: 'Bad param exception' })
  /**
   * Returns a list of concerts
   * @param {number[] | number} params.bandIds - The band ids
   * @param {number} params.longitude - The longitude
   * @param {number} params.latitude - The latitude
   * @param {number} params.radius - The radius
   * @returns {Observable<Concert[]>}
   */
  list(
    @Query(TransformParamsPipe) params: QueryParamDto,
  ): Observable<Concert[]> {
    return this.concertsGatewayService.list(params).pipe(
      catchError((error: MicroServiceError) => {
        return throwError(
          new HttpException(
            {
              statusCode: error.status,
              message: error.message,
            },
            error.status,
          ),
        );
      }),
    );
  }
}
