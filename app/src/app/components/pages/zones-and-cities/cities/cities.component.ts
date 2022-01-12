import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { City } from 'src/app/models/city.model';
import { Zone } from 'src/app/models/zone.model';
import { ZonesAndCitiesService } from 'src/app/services/zones-and-cities.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {

  displayedColumns: string[] = ['city_id', 'name', 'nr_of_residents', 'postcode', 'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<City>;
  zonesForCity: Zone[];
  currentAction: Actions = Actions.None;
  currentCity: City;
  newCity: City;

  blankCity: City = {
    name: ''
  };

  constructor(private zonesAndCitiesService: ZonesAndCitiesService) {
    this.dataSource = new MatTableDataSource();
    this.zonesAndCitiesService.cities$.subscribe((data) => {
      this.dataSource.data = data;
    })
  }

  ngOnInit(): void {
    this.zonesAndCitiesService.getCities()
  }

  showPanel(type: string, city?: City) {
    if (city) this.currentCity = city;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.newCity = JSON.parse(JSON.stringify(this.blankCity));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.newCity = JSON.parse(JSON.stringify(this.currentCity));
        break; 
      }
      case 'delete': { 
        this.currentAction = Actions.Delete;
        this.zonesForCity = this.zonesAndCitiesService.getZonesOfCity(this.currentCity.city_id);
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

  editCity(city: City) {
    this.zonesAndCitiesService.updateCity(city);
    this.showPanel('view', city);
  }

  addCity(city: City) {
    this.zonesAndCitiesService.addCity(city);
    this.showPanel('view', city);
  }

  deleteCity(city: City) {
    this.zonesAndCitiesService.deleteCity(city.city_id);
    this.showPanel('none');
  }

  isFormValid() {
    if (this.newCity.name == '') {
      return false;
    } else return true;
  }
}
