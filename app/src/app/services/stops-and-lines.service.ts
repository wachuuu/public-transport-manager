import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Stop } from '../models/stop.model';

@Injectable({
  providedIn: 'root'
})
export class StopsAndLinesService {

  constructor(private http: HttpClient) { }

  readonly stopsUrl: string = `${environment.apiUrl}/api/stops`;
  readonly stopOrdersUrl: string = `${environment.apiUrl}/api/stop_orders`;
  readonly linesUrl: string = `${environment.apiUrl}/api/lines`;
  
  private readonly _stops$ = new BehaviorSubject<Stop[]>([]);
  readonly stops$ = this._stops$.asObservable();
  get stops() { return this._stops$.getValue(); }
  set stops(value) { this._stops$.next(value); }

  public getStops() {
    this.http.get<Stop[]>(this.stopsUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.stops = response.body;
    })
  }

  public getStopById(stop_id: number) {
    this.getStops();
    return this.stops.find((item) => item.stop_id == stop_id);
  }

  public getStopsForZone(zone_id: number) {
    this.getStops();
    return this.stops.filter(item => item.zone.zone_id == zone_id);
  }

  public addStop(stop: Stop) {
    this.http.post<Stop>(this.stopsUrl, stop, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.stops = [...this.stops, response.body];
      }
    })
  }

  public updateStop(stop: Stop) {
    this.http.put<Stop>(`${this.stopsUrl}/${stop.stop_id}`, stop, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.stops.findIndex((item) => item.stop_id == response.body.stop_id);
        if (index > -1) {
          this.stops[index] = response.body;
          this._stops$.next(this.stops);
        }
      }
    })
  }

  public deleteStop(stop_id: number) { 
    this.http.delete(`${this.stopsUrl}/${stop_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.stops.findIndex((item) => item.stop_id == stop_id);
        this.stops.splice(index, 1);
        this._stops$.next(this.stops);
      }
    })
  }
}
