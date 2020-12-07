import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class QueryParamDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Max(90)
  @Min(-90)
  latitude?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Max(180)
  @Min(-180)
  longitude?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  radius?: number;

  @ApiProperty({ type: 'number', isArray: true })
  @IsNumber({}, { each: true })
  @IsOptional()
  bandIds?: number[];
}
