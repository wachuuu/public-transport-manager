import { Component } from '@angular/core';
import { BusesService } from 'src/app/services/buses.service';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss']
})
export class BusesComponent {

  constructor(private busesService: BusesService) {}

  onTabChange() {
    this.busesService.getModels();
    this.busesService.getBrands();
    this.busesService.getBuses();
  }
}
