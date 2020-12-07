import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UnknownExceptionFilter } from '@libs/exceptions';

import { ConcertsService } from '../services/concerts.service';
import { ConcertDocument } from '../models/concerts.model';

@Controller()
@UseFilters(UnknownExceptionFilter)
export class ConcertsController {
  constructor(private concertsService: ConcertsService) {}

  @MessagePattern('list')
  /**
   * Return a list of concerts
   * @returns {Promise<Concert[]>}
   */
  list(): Promise<ConcertDocument[]> {
    return this.concertsService.list();
  }
}
