import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of, ConnectableObservable} from 'rxjs';
import {Flight} from '../models/flight';
import { share, publish, delay, catchError, map } from 'rxjs/operators';


@Injectable()
export class FlightService {

  flights: Flight[] = [];
  // baseUrl = `https://flight-api-demo.azurewebsites.net/api`;
  baseUrl = `http://localhost:5000/api`;
  reqDelay = 1000;

  constructor(private http: HttpClient) {
  }

  load(from: string, to: string, urgent: boolean): void {
    const o = this.find(from, to, urgent)
                .subscribe(
                  flights => {
                    this.flights = flights;
                  },
                  err => console.error('Error loading flights', err)
                );
  }

  find(from: string, to: string, urgent: boolean = false): Observable<Flight[]> {

    // For offline access
    // let url = '/assets/data/data.json';

    // For online access
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl,'error?code=403'].join('/');
    }

    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    const headers = new HttpHeaders()
      .set('Accept', 'application/json');

    const reqObj = {params, headers};
    return this.http.get<Flight[]>(url, reqObj)
            .pipe(catchError(err => of([])))
    
    //.pipe(delay(7000));
    // return of(flights).pipe(delay(this.reqDelay))

  }

  findById(id: string): Observable<Flight> {
    const reqObj = { params: null };
    reqObj.params = new HttpParams().set('id', id).set('expand', 'true');
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.get<Flight>(url, reqObj).pipe(delay(7000));
    // return of(flights[0]).pipe(delay(this.reqDelay))
  }

  save(flight: Flight): Observable<Flight> {
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.post<Flight>(url, flight);
  }

  delay() {
    const ONE_MINUTE = 1000 * 60;

    const oldFlights = this.flights;
    const oldFlight = oldFlights[0];
    const oldDate = new Date(oldFlight.date);

    // Mutable
    oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
    oldFlight.date = oldDate.toISOString();
  }

}
