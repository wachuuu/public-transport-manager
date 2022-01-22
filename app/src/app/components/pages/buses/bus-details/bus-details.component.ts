import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Brand } from 'src/app/models/brand.model';
import { Bus } from 'src/app/models/bus.model';
import { BusModel } from 'src/app/models/busModel.model';
import { BusesService } from 'src/app/services/buses.service';

@Component({
  selector: 'app-bus-details',
  templateUrl: './bus-details.component.html',
  styleUrls: ['./bus-details.component.scss']
})
export class BusDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['bus_id', 'number_plate', 'purchase', 'cost', 'bus_model', 
                                'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<Bus>;
  currentAction: Actions = Actions.None;
  models: BusModel[];
  brands: Brand[];
  addNewModel: boolean = false;
  addNewBrand: boolean = false;
  currentBus: Bus;
  newBus: Bus;
  
  blankBrand: Brand = {
    name: ''
  };

  blankModel: BusModel = {
    model_name: '',
    brand: this.blankBrand
  };

  blankBus: Bus = {
    number_plate: '',
    bus_model: this.blankModel
  };
  
  constructor(private busService: BusesService) {
    this.dataSource = new MatTableDataSource();
    this.busService.buses$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.busService.models$.subscribe((data) => {
      this.models = data;
    })

    this.busService.brands$.subscribe((data) => {
      this.brands = data;
    })
  }
  
  ngOnInit(): void {
    this.busService.getBuses();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  showPanel(type: string, bus?: Bus) {
    if (bus) this.currentBus = bus;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.busService.getModels();
        this.busService.getBrands();
        this.newBus = JSON.parse(JSON.stringify(this.blankBus));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.busService.getModels();
        this.busService.getBrands();
        this.newBus = JSON.parse(JSON.stringify(this.currentBus));
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

  editBus(bus: Bus) {
    this.busService.updateBus(bus);
    this.showPanel('view', bus);
  }

  addBus(bus: Bus) {
    this.busService.addBus(bus);
    this.showPanel('view', bus);
  }

  deleteBus(bus: Bus) {
    this.busService.deleteBus(bus.bus_id);
    this.showPanel('none');
  }

  clearBusModelFields() {
    this.newBus.bus_model = JSON.parse(JSON.stringify(this.blankModel))
  }

  clearModelBrandFields() {
    this.newBus.bus_model.brand = JSON.parse(JSON.stringify(this.blankBrand))
  }

  isFormValid() {
    if (this.newBus.number_plate == '' ||
        this.newBus.bus_model.model_name == '' ||
        this.newBus.bus_model.brand.name == '') {
        return false;
    } else return true;
  }
}
