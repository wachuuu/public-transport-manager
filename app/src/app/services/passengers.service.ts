import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Passenger } from '../models/passenger.model';

@Injectable({
  providedIn: 'root'
})
export class PassengersService {

  constructor(private http: HttpClient) { }
  readonly url: string = `${environment.apiUrl}/api/passengers`;

  private readonly _passengers$ = new BehaviorSubject<Passenger[]>([]);
  readonly passengers$ = this._passengers$.asObservable();
  get passengers() { return this._passengers$.getValue(); }
  set passengers(value) { this._passengers$.next(value); }

  public getPassengers() {
    this.http.get<Passenger[]>(this.url, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.passengers = response.body;
    })
  }

  public getPassengersForTicket(ticket_id: number) {
    this.getPassengers();
    return this.passengers.filter(item => item.ticket.ticket_id == ticket_id);
  }

  public getPassengerById(passenger_id: number) {
    this.getPassengers();
    return this.passengers.find((item) => item.passenger_id == passenger_id);
  }

  public addPassenger(passenger: Passenger) {
    this.http.post<Passenger>(this.url, passenger, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.passengers = [...this.passengers, response.body];
      }
    })
  }

  public updatePassenger(passenger: Passenger) {
    this.http.put<Passenger>(`${this.url}/${passenger.passenger_id}`, passenger, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.passengers.findIndex((item) => item.passenger_id == response.body.passenger_id);
        if (index > -1) {
          this.passengers[index] = response.body;
          this._passengers$.next(this.passengers);
        }
      }
    })
  }

  public deletePassenger(passenger_id: number) { 
    this.http.delete(`${this.url}/${passenger_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.passengers.findIndex((item) => item.passenger_id == passenger_id);
        this.passengers.splice(index);
        this._passengers$.next(this.passengers);
      }
    })
  }
}
