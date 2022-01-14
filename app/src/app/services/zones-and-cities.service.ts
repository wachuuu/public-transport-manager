import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models/city.model';
import { ZoneAffiliation } from '../models/zone-affiliation.model';
import { ZoneWithCities } from '../models/zone-with-cities.model';
import { Zone } from '../models/zone.model';

@Injectable({
  providedIn: 'root'
})
export class ZonesAndCitiesService {

  constructor(private http: HttpClient) { }

  readonly citiesUrl: string = `${environment.apiUrl}/api/cities`;
  readonly zonesUrl: string = `${environment.apiUrl}/api/zones`;
  readonly affiliationsUrl: string = `${environment.apiUrl}/api/zone_affiliations`;
  
  private readonly _cities$ = new BehaviorSubject<City[]>([]);
  readonly cities$ = this._cities$.asObservable();
  get cities() { return this._cities$.getValue(); }
  set cities(value) { this._cities$.next(value); }
  
  private readonly _zones$ = new BehaviorSubject<Zone[]>([]);
  readonly zones$ = this._zones$.asObservable();
  get zones() { return this._zones$.getValue(); }
  set zones(value) { this._zones$.next(value); }

  private readonly _zonesWithCities$ = new BehaviorSubject<ZoneWithCities[]>([]);
  readonly zonesWithCities$ = this._zonesWithCities$.asObservable();
  get zonesWithCities() { return this._zonesWithCities$.getValue(); }
  set zonesWithCities(value) { this._zonesWithCities$.next(value); }

  private readonly _affiliations$ = new BehaviorSubject<ZoneAffiliation[]>([]);
  readonly affiliations$ = this._affiliations$.asObservable();
  get affiliations() { return this._affiliations$.getValue(); }
  set affiliations(value) { this._affiliations$.next(value); }

  public getZonesWithCities() {
    let _zones: Zone[];
    let zonesWithCities: ZoneWithCities[] = [];
    
    let affiliations: ZoneAffiliation[];
    this.http.get<Zone[]>(this.zonesUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        _zones = response.body;
        this.http.get<ZoneAffiliation[]>(this.affiliationsUrl, { observe: 'response' }).subscribe((response) => {
          if (response.ok) {
            affiliations = response.body;
            _zones.forEach((zone) => {
              let _zoneWithCities: ZoneWithCities = {};
              _zoneWithCities.zone = zone;
              _zoneWithCities.cities = affiliations
                .filter(item => item.zone.zone_id == zone.zone_id)
                .map((item) => {return item.city})
              zonesWithCities.push(_zoneWithCities);
            })
            this._zonesWithCities$.next(zonesWithCities);
          }
        })
      }
    })
  }

  public getCities() {
    this.http.get<City[]>(this.citiesUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.cities = response.body;
    })
  }

  public getCityById(city_id: number) {
    this.getCities();
    return this.cities.find((item) => item.city_id == city_id);
  }

  public addCity(city: City) {
    this.http.post<City>(this.citiesUrl, city, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.cities = [...this.cities, response.body];
      }
    })
  }

  public updateCity(city: City) {
    this.http.put<City>(`${this.citiesUrl}/${city.city_id}`, city, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.cities.findIndex((item) => item.city_id == response.body.city_id);
        if (index > -1) {
          this.cities[index] = response.body;
          this._cities$.next(this.cities);
        }
      }
    })
  }

  public deleteCity(city_id: number) { 
    this.http.delete(`${this.citiesUrl}/${city_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.cities.findIndex((item) => item.city_id == city_id);
        this.cities.splice(index, 1);
        this._cities$.next(this.cities);
      }
    })
  }

  public getZones() {
    this.http.get<Zone[]>(this.zonesUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.zones = response.body;
    })
  }

  public getZoneById(zone_id: number) {
    this.getZones();
    return this.zones.find((item) => item.zone_id == zone_id);
  }

  public addZone(zone: Zone) {
    this.http.post<Zone>(this.zonesUrl, zone, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.zones = [...this.zones, response.body];
      }
    })
  }

  public addZoneWithCities(zone: Zone, cities: City[]) {
    this.http.post<Zone>(this.zonesUrl, zone, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.zones = [...this.zones, response.body];
        let zone_id = response.body.zone_id;

        cities.forEach((item) => {
          let affiliation: ZoneAffiliation = {
            zone: { zone_id: zone_id },
            city: { city_id: item.city_id }
          };
          this.addAffiliation(affiliation);
        })
      }
    })
  }

  public updateZone(zone: Zone) {
    this.http.put<Zone>(`${this.zonesUrl}/${zone.zone_id}`, zone, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.zones.findIndex((item) => item.zone_id == response.body.zone_id);
        if (index > -1) {
          this.zones[index] = response.body;
          this._zones$.next(this.zones);
          this.getZonesWithCities();
        }
      }
    })
  }

  public deleteZone(zone_id: number) { 
    this.http.delete(`${this.zonesUrl}/${zone_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.zones.findIndex((item) => item.zone_id == zone_id);
        this.zones.splice(index, 1);
        this._zones$.next(this.zones);
        this.getZonesWithCities();
      }
    })
  }

  public getAffiliations() {
    this.http.get<ZoneAffiliation[]>(this.affiliationsUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.affiliations = response.body;
    })
  }

  public getAffiliationById(affiliation_id: number) {
    this.getAffiliations();
    return this.affiliations.find((item) => item.affiliation_id == affiliation_id);
  }

  public getAffiliationByZoneAndCity(zone_id: number, city_id: number) {
    this.getAffiliations();
    return this.affiliations.find(item => item.zone.zone_id == zone_id && item.city.city_id == city_id);
  }

  public getCitiesOfZone(zone_id: number) {
    this.getAffiliations();
    return this.affiliations.filter(item => item.zone.zone_id == zone_id).map((item) => {return item.city});
  }

  public getZonesOfCity(city_id: number) {
    this.getAffiliations();
    return this.affiliations.filter(item => item.city.city_id == city_id).map((item) => {return item.zone});
  }

  public addAffiliation(affiliation: ZoneAffiliation) {
    this.http.post<ZoneAffiliation>(this.affiliationsUrl, affiliation, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.affiliations = [...this.affiliations, response.body];
        this.getZonesWithCities();
      }
    })
  }

  public updateAffiliation(affiliation: ZoneAffiliation) {
    this.http.put<ZoneAffiliation>(`${this.affiliationsUrl}/${affiliation.affiliation_id}`, affiliation, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.affiliations.findIndex((item) => item.affiliation_id == response.body.affiliation_id);
        if (index > -1) {
          this.affiliations[index] = response.body;
          this._affiliations$.next(this.affiliations);
          this.getZonesWithCities();
        }
      }
    })
  }

  public deleteAffiliation(affiliation_id: number) { 
    this.http.delete(`${this.affiliationsUrl}/${affiliation_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.affiliations.findIndex((item) => item.affiliation_id == affiliation_id);
        this.affiliations.splice(index, 1);        
        this._affiliations$.next(this.affiliations);
        this.getZonesWithCities();
      }
    })
  }

  public deleteAffiliationByCityAndZone(zone_id: number, city_id: number) {
    this.http.get<ZoneAffiliation[]>(this.affiliationsUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let affiliation = response.body.find(item => item.zone.zone_id == zone_id && item.city.city_id == city_id);
        if (affiliation) this.deleteAffiliation(affiliation.affiliation_id);
      }
    })
  }
}
