import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/brand.model';
import { Bus } from 'src/app/models/bus.model';
import { BusModel } from 'src/app/models/busModel.model';
import { BusesService } from 'src/app/services/buses.service';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss']
})
export class BusesComponent implements OnInit {

  brands: Brand[];
  models: BusModel[];
  buses: Bus[];

  constructor(private busesService: BusesService) {
    this.busesService.brands$.subscribe((data) => {
      this.brands = data;
    })

    this.busesService.models$.subscribe((data) => {
      this.models = data;
    })
    
    this.busesService.buses$.subscribe((data) => {
      this.buses = data;
    })
  }

  ngOnInit(): void {
    this.busesService.getBrands();
    this.busesService.getModels();
    this.busesService.getBuses();
  }
}
