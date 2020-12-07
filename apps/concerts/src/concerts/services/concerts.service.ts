import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { DatabaseError } from '@libs/exceptions';

import { Concert, ConcertDocument } from '../models/concerts.model';

@Injectable()
export class ConcertsService {
  private logger: Logger;

  constructor(
    @InjectModel(Concert.name) private bandModel: Model<ConcertDocument>,
  ) {
    this.logger = new Logger('ConcertsService');
  }

  /**
   * Return a list of concerts
   * @returns {Promise<Concert[]>}
   */
  async list(): Promise<ConcertDocument[]> {
    try {
      return await this.bandModel.find().sort({ date: -1 }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new DatabaseError();
    }
  }
}
