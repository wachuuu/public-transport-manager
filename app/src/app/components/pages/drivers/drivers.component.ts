import { Component, OnInit } from '@angular/core';
import { Driver } from 'src/app/models/driver.model';
import { DriversService } from 'src/app/services/drivers.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {

  drivers: Driver[];

  constructor(private driversService: DriversService) {
    this.driversService.drivers$.subscribe((data) => {
      this.drivers = data;
    })
  }
  
  ngOnInit(): void {
    this.driversService.getDrivers()
  }
}
