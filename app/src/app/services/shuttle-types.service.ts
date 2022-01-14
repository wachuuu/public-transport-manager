import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShuttleType } from '../models/shuttle-types';

@Injectable({
  providedIn: 'root'
})
export class ShuttleTypesService {

  constructor(private http: HttpClient) { }

  readonly url: string = `${environment.apiUrl}/api/shuttle_types`;

  private readonly _shuttle_types$ = new BehaviorSubject<ShuttleType[]>([]);
  readonly shuttle_types$ = this._shuttle_types$.asObservable();
  get shuttle_types() { return this._shuttle_types$.getValue(); }
  set shuttle_types(value) { this._shuttle_types$.next(value); }

  public getShuttleTypes() {
    this.http.get<ShuttleType[]>(this.url, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.shuttle_types = response.body;
    })
  }

  public getShuttleTypeById(shuttle_type_id: number) {
    this.getShuttleTypes();
    return this.shuttle_types.find((item) => item.shuttle_type_id == shuttle_type_id);
  }

  public addShuttleType(shuttleType: ShuttleType) {
    this.http.post<ShuttleType>(this.url, shuttleType, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.shuttle_types = [...this.shuttle_types, response.body];
      }
    })
  }

  public updateShuttleType(shuttleType: ShuttleType) {
    this.http.put<ShuttleType>(`${this.url}/${shuttleType.shuttle_type_id}`, shuttleType, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.shuttle_types.findIndex((item) => item.shuttle_type_id == response.body.shuttle_type_id);
        if (index > -1) {
          this.shuttle_types[index] = response.body;
          this._shuttle_types$.next(this.shuttle_types);
        }
      }
    })
  }

  public deleteShuttleType(shuttle_type_id: number) {
    this.http.delete(`${this.url}/${shuttle_type_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.shuttle_types.findIndex((item) => item.shuttle_type_id == shuttle_type_id);
        this.shuttle_types.splice(index, 1);
        this._shuttle_types$.next(this.shuttle_types);
      }
    })
  }
}
