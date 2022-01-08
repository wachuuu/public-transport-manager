import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Driver } from 'src/app/models/driver.model';
import { DriversService } from 'src/app/services/drivers.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {

  drivers: Driver[];
  displayedColumns: string[] = ['driver_id', 'name', 'surname', 'email', 'phone_number', 
                                'more', 'edit', 'delete'];
  currentAction: Actions = Actions.None;
  currentDriver: Driver;
  newDriver: Driver;
  blankDriver: Driver = {
    name: '',
    surname: '',
    pesel: '',
    phone_number: '',
    email: '',
    address: '',
    salary: 0
  };

  dataSource: MatTableDataSource<Driver>;

  constructor(private driversService: DriversService) {
    this.dataSource = new MatTableDataSource();
    this.driversService.drivers$.subscribe((data) => {
      this.dataSource.data = data;
    })
  }
  
  ngOnInit(): void {
    this.driversService.getDrivers();
  }
  
  showPanel(type: string, driver?: Driver) {
    if (driver) this.currentDriver = driver;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.newDriver = JSON.parse(JSON.stringify(this.blankDriver));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.newDriver = JSON.parse(JSON.stringify(this.currentDriver));
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

  deleteDriver(driver: Driver) {
    this.driversService.deleteDriver(driver.driver_id);
    this.showPanel('none');
  }

  addDriver(driver: Driver) {
    this.driversService.addDriver(driver);
    this.showPanel('view', driver);
  }

  editDriver(driver: Driver) {
    this.driversService.updateDriver(driver)
    this.showPanel('view', driver);
  }
}
