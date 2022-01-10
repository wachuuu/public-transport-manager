import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from '../models/brand.model';
import { Bus } from '../models/bus.model';
import { BusModel } from '../models/busModel.model';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  constructor(private http: HttpClient) { }

  readonly brandsUrl: string = `${environment.apiUrl}/api/brands`;
  readonly modelsUrl: string = `${environment.apiUrl}/api/bus_models`;
  readonly busesUrl: string = `${environment.apiUrl}/api/buses`;
  
  private readonly _brands$ = new BehaviorSubject<Brand[]>([]);
  readonly brands$ = this._brands$.asObservable();
  get brands() { return this._brands$.getValue(); }
  set brands(value) { this._brands$.next(value); }
  
  private readonly _models$ = new BehaviorSubject<BusModel[]>([]);
  readonly models$ = this._models$.asObservable();
  get models() { return this._models$.getValue(); }
  set models(value) { this._models$.next(value); }

  private readonly _buses$ = new BehaviorSubject<Bus[]>([]);
  readonly buses$ = this._buses$.asObservable();
  get buses() { return this._buses$.getValue(); }
  set buses(value) { this._buses$.next(value); }
  
  public getBrands() {
    this.http.get<Brand[]>(this.brandsUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.brands = response.body;
    })
  }

  public getBrandById(brand_id: number) {
    this.getBrands();
    return this.brands.find((item) => item.brand_id == brand_id);
  }

  public addBrand(brand: Brand) {
    // TODO: change this after buses patch:
    // brand_id should be null or not exist in database to not override existing brand
    // temporary set brand_id to null but delete this after patch
    brand.brand_id = null;

    this.http.post<Brand>(this.brandsUrl, brand, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.brands = [...this.brands, response.body];
      }
    })
  }

  public updateBrand(brand: Brand) {
    this.http.put<Brand>(`${this.brandsUrl}/${brand.brand_id}`, brand, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.brands.findIndex((item) => item.brand_id == response.body.brand_id);
        if (index > -1) {
          this.brands[index] = response.body;
          this._brands$.next(this.brands);
        }
      }
    })
  }

  public deleteBrand(brand_id: number) { 
    this.http.delete(`${this.brandsUrl}/${brand_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.brands.findIndex((item) => item.brand_id == brand_id);
        this.brands.splice(index);
        this._brands$.next(this.brands);
      }
    })
  }

  public getModels() {
    this.http.get<BusModel[]>(this.modelsUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.models = response.body;
    })
  }

  public getModelById(model_id: number) {
    this.getModels();
    return this.models.find((item) => item.model_id == model_id);
  }

  public getBusesForModel(model_id: number) {
    this.getBuses();
    return this.buses.filter(item => item.bus_model.model_id == model_id);
  }

  public addModel(model: BusModel) {
    this.http.post<BusModel>(this.modelsUrl, model, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.models = [...this.models, response.body];
      }
    })
  }

  public updateModel(model: BusModel) {
    this.http.put<BusModel>(`${this.modelsUrl}/${model.model_id}`, model, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.models.findIndex((item) => item.model_id == response.body.model_id);
        if (index > -1) {
          this.models[index] = response.body;
          this._models$.next(this.models);
        }
      }
    })
  }
  
  public deleteModel(model_id: number) {
    this.http.delete(`${this.modelsUrl}/${model_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.models.findIndex((item) => item.model_id == model_id);
        this.models.splice(index);
        this._models$.next(this.models);
      }
    })
  }

  public getBuses() {
    this.http.get<Bus[]>(this.busesUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.buses = response.body;
    })
  }

  public getBusById(bus_id: number) {
    this.getBuses();
    return this.buses.find((item) => item.bus_id == bus_id);
  }

  public addBus(bus: Bus) {
    this.http.post<Bus>(this.busesUrl, bus, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.buses = [...this.buses, response.body];
      }
    })
  }

  public updateBus(bus: Bus) {
    this.http.put<Bus>(`${this.busesUrl}/${bus.bus_id}`, bus, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.buses.findIndex((item) => item.bus_id == response.body.bus_id);
        if (index > -1) {
          this.buses[index] = response.body;
          this._buses$.next(this.buses);
        }
      }
    })
  }

  public deleteBus(bus_id: number) {
    this.http.delete(`${this.busesUrl}/${bus_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.buses.findIndex((item) => item.bus_id == bus_id);
        this.buses.splice(index);
        this._buses$.next(this.buses);
      }
    })
  }
}
