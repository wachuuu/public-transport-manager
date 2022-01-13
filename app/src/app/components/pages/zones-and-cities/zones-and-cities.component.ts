import { Component } from '@angular/core';
import { ZonesAndCitiesService } from 'src/app/services/zones-and-cities.service';

@Component({
  selector: 'app-zones-and-cities',
  templateUrl: './zones-and-cities.component.html',
  styleUrls: ['./zones-and-cities.component.scss']
})
export class ZonesAndCitiesComponent {

  constructor(private zonesAndCitiesService: ZonesAndCitiesService) { }

  onTabChange() {
    this.zonesAndCitiesService.getZones();
    this.zonesAndCitiesService.getCities();
    this.zonesAndCitiesService.getAffiliations();
  }
}
