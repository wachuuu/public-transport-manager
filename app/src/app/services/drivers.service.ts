import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  constructor(private http: HttpClient) { }

  readonly url: string = `${environment.apiUrl}/api/transport/drivers`;
  
  private readonly _drivers$ = new BehaviorSubject<Driver[]>([]);
  readonly drivers$ = this._drivers$.asObservable();
  get drivers() { return this._drivers$.getValue(); }
  set drivers(value) { this._drivers$.next(value); }

  public getDrivers() {
    this.http.get<Driver[]>(this.url, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.drivers = response.body;
    })
  }

  public addDriver(driver: Driver) {
    this.http.post<Driver>(this.url, driver, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.drivers = [...this.drivers, response.body];
    })
  }

  public deleteDriver(driver_id: number) {
    this.http.delete(`${this.url}/${driver_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.drivers.findIndex((item) => {item.driver_id == driver_id});
        this.drivers.splice(index);
        this._drivers$.next(this.drivers);
      }
    })
  }

  public updateDriver(driver: Driver) {
    this.http.put<Driver>(`${this.url}/${driver.driver_id}`, driver, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        // TODO: figre out why this is not working
        // let index = this.drivers.findIndex((item) => {item.driver_id == driver.driver_id});
        // this.drivers[index] = driver;
        // this._drivers$.next(this.drivers);

        // workaround solution
        this.getDrivers();
      }
    })

  }
}
