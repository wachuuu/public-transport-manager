import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { City } from 'src/app/models/city.model';
import { ZoneAffiliation } from 'src/app/models/zone-affiliation.model';
import { ZoneWithCities } from 'src/app/models/zone-with-cities.model';
import { ZonesAndCitiesService } from 'src/app/services/zones-and-cities.service';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {

  displayedColumns: string[] = ['zone_id', 'symbol', 'cities', 'more', 'edit', 'delete'];

  dataSource: MatTableDataSource<ZoneWithCities>;
  currentAction: Actions = Actions.None;
  affiliations: ZoneAffiliation[];
  allCities: City[];
  selectedCities: number[] = [];
  currentZone: ZoneWithCities;
  newZone: ZoneWithCities;

  blankZone: ZoneWithCities = {
    zone: {
      symbol: ''
    },
    cities: []
  }

  constructor(private zonesAndCitiesService: ZonesAndCitiesService) {
    this.dataSource = new MatTableDataSource();
    this.zonesAndCitiesService.zonesWithCities$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.zonesAndCitiesService.affiliations$.subscribe((data) => {
      this.affiliations = data;
    })

    this.zonesAndCitiesService.cities$.subscribe((data) => {
      this.allCities = data;
    })
  }

  ngOnInit(): void {
    this.zonesAndCitiesService.getZones();
    this.zonesAndCitiesService.getCities();
    this.zonesAndCitiesService.getAffiliations();
    this.zonesAndCitiesService.getZonesWithCities();
  }

  showPanel(type: string, zone?: ZoneWithCities) {
    if (zone) this.currentZone = zone;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.newZone = JSON.parse(JSON.stringify(this.blankZone));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.zonesAndCitiesService.getCities();
        this.selectedCities = this.currentZone.cities.map((item) => {return item.city_id});
        this.newZone = JSON.parse(JSON.stringify(this.currentZone));
        break; 
      }
      case 'delete': { 
        this.currentAction = Actions.Delete;
        break; 
      }
      default: { 
        this.currentAction = Actions.None;
        break; 
      } 
    }
  }

  isActivePanel(type: string) {
    switch(type) { 
      case 'none': { 
        if (this.currentAction == Actions.None) 
          return true;
        else return false;
      } 
      case 'add-new': { 
        if (this.currentAction == Actions.AddNew)
          return true;
        else return false;
      }
      case 'view': { 
        if (this.currentAction == Actions.View)
          return true;
        else return false;
      }
      case 'edit': { 
        if (this.currentAction == Actions.Edit)
          return true;
        else return false;
      }
      case 'delete': { 
        if (this.currentAction == Actions.Delete)
          return true;
        else return false;
      }
      default: { 
        return false;
      } 
    }
  }

  editZone(zone: ZoneWithCities, selectedCities: number[]) {
    let currentCities = zone.cities.map(item => item.city_id);
    if (currentCities != selectedCities) {
      // removed cities from zone
      currentCities.filter(item => selectedCities.indexOf(item) < 0).forEach((item) => {
        this.removeCityFromZone(zone.zone.zone_id, item);
        let index = zone.cities.findIndex(city => city.city_id == item);
        zone.cities.splice(index, 1);
      })

      // added cities to zone
      selectedCities.filter(item => currentCities.indexOf(item) < 0).forEach((item) => {
        this.addCityToZone(zone.zone.zone_id, item);
        let newCity = this.allCities.find(city => city.city_id == item);
        zone.cities.push(newCity);
      })
    }
    if (zone.zone.symbol != this.currentZone.zone.symbol) {
      this.zonesAndCitiesService.updateZone(zone.zone);
    }
    
    this.showPanel('view', zone);
  }

  addZone(zone: ZoneWithCities, selectedCities: number[]) {
    if (selectedCities.length > 0) {
      selectedCities.forEach((item) => {
        let newCity = this.allCities.find(city => city.city_id == item)
        if (newCity) zone.cities.push(newCity)
      })
      this.zonesAndCitiesService.addZoneWithCities(zone.zone, zone.cities);
    } else {
      this.zonesAndCitiesService.addZone(zone.zone);
    }
    this.showPanel('view', zone);
  }

  deleteZone(zone: ZoneWithCities) {
    this.zonesAndCitiesService.deleteZone(zone.zone.zone_id);
    this.showPanel('none');
  }

  addCityToZone(zone_id: number, city_id: number) {
    let zoneAffilation: ZoneAffiliation = {
      zone: {
        zone_id: zone_id
      },
      city: {
        city_id: city_id
      }
    };
    this.zonesAndCitiesService.addAffiliation(zoneAffilation);
  }

  removeCityFromZone(zone_id: number, city_id: number) {
    this.zonesAndCitiesService.deleteAffiliationByCityAndZone(zone_id, city_id);
  }

  isFormValid() {
    if (this.newZone.zone.symbol == '') {
      return false;
    } else return true;
  }
}
