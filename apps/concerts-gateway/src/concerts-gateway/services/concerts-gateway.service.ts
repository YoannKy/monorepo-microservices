import { Injectable } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';

import { Observable } from 'rxjs';

import { IVenue as Venue, VenueQueryParameters } from '@libs/venue-model';
import { IBand as Band, BandQueryParameters } from '@libs/band-model';
import { IConcert } from '@libs/concert-model';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Concert } from '../models/concerts-gateway.model';
import { QueryParamDto } from '../dto/concerts-gateway.dto';

@Injectable()
export class ConcertsGatewayService {
  private bandClient: ClientProxy;
  private concertClient: ClientProxy;
  private venueClient: ClientProxy;

  constructor() {
    this.bandClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.MONGO_HOST_BANDS,
        port: +process.env.MICROSERVICE_PORT_BANDS,
      },
    });

    this.concertClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.MONGO_HOST_CONCERTS,
        port: +process.env.MICROSERVICE_PORT_CONCERTS,
      },
    });

    this.venueClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.MONGO_HOST_VENUES,
        port: +process.env.MICROSERVICE_PORT_VENUES,
      },
    });
  }

  /**
   * Request the bands microservice, the concerts microservice, the venues microservice
   * and merge the aggregated data into a new formats
   * @param {number[] | number} params.bandIds - The band ids
   * @param {number} params.longitude - The longitude
   * @param {number} params.latitude - The latitude
   * @param {number} params.radius - The radius
   * @returns {Observable<Concert[]>}
   */
  list({
    bandIds,
    longitude,
    latitude,
    radius,
  }: QueryParamDto): Observable<Concert[]> {
    return forkJoin([
      this.listBands(bandIds),
      this.listConcerts(),
      this.listVenues({
        longitude,
        latitude,
        radius,
      }),
    ]).pipe(
      map(([bands, concerts, venues]) => {
        const bandIds = bands.map(({ id }) => id);
        const venueIds = venues.map(({ id }) => id);

        return concerts.reduce((acc: Concert[], concert) => {
          const foundBandIndex = bandIds.findIndex(
            (id) => id === concert.bandId,
          );
          const foundVenueIndex = venueIds.findIndex(
            (id) => id === concert.venueId,
          );
          if (foundBandIndex !== -1 && foundVenueIndex !== -1) {
            acc.push({
              date: concert.date,
              latitude: venues[foundVenueIndex].latitude,
              longitude: venues[foundVenueIndex].longitude,
              location: venues[foundVenueIndex].name,
              band: bands[foundBandIndex].name,
            });
          }
          return acc;
        }, []);
      }),
    );
  }

  /**
   * Request the bands from the bands microservice
   * and merge the aggregated data into a new formats
   * @param {number[] | number} params.bandIds - The band ids
   * @returns {Observable<Band[]>}
   */
  private listBands(
    bandIds: BandQueryParameters['bandIds'],
  ): Observable<Band[]> {
    return this.bandClient.send('list', { bandIds });
  }

  /**
   * Request the concerts from the concerts microservice
   * and merge the aggregated data into a new formats
   * @param {number[] | number} params.bandIds - The band ids
   * @returns {Observable<Concert[]>}
   */
  private listConcerts(): Observable<IConcert[]> {
    return this.concertClient.send('list', {});
  }

  /**
   * Request the venues from the venues microservice
   * @param {number} params.longitude - The longitude
   * @param {number} params.latitude - The latitude
   * @param {number} params.radius - The radius
   * @returns {Observable<Venue[]>}
   */
  private listVenues({
    latitude,
    longitude,
    radius,
  }: VenueQueryParameters): Observable<Venue[]> {
    return this.venueClient.send('list', { latitude, longitude, radius });
  }
}
