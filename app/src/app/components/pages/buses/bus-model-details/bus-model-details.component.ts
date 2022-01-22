import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Brand } from 'src/app/models/brand.model';
import { Bus } from 'src/app/models/bus.model';
import { BusModel } from 'src/app/models/busModel.model';
import { BusesService } from 'src/app/services/buses.service';

@Component({
  selector: 'app-bus-model-details',
  templateUrl: './bus-model-details.component.html',
  styleUrls: ['./bus-model-details.component.scss']
})
export class BusModelDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['model_id', 'model_name', 'year_of_production', 'number_of_seats', 'brand', 
                                'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<BusModel>;
  currentAction: Actions = Actions.None;
  brands: Brand[];
  busesForModel: Bus[];
  addNewBrand: boolean = false;
  currentModel: BusModel;
  newModel: BusModel;

  blankBrand: Brand = {
    name: ''
  };

  blankModel: BusModel = {
    model_name: '',
    brand: this.blankBrand
  };

  constructor(private busService: BusesService) {
    this.dataSource = new MatTableDataSource();
    this.busService.models$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.busService.brands$.subscribe((data) => {
      this.brands = data;
    })
  }

  ngOnInit(): void {
    this.busService.getModels();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  showPanel(type: string, model?: BusModel) {
    if (model) this.currentModel = model;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.busService.getBrands();
        this.newModel = JSON.parse(JSON.stringify(this.blankModel));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.busService.getBrands();
        this.newModel = JSON.parse(JSON.stringify(this.currentModel));
        break; 
      }
      case 'delete': { 
        this.currentAction = Actions.Delete;
        this.busesForModel = this.busService.getBusesForModel(this.currentModel.model_id);
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

  editModel(model: BusModel) {
    this.busService.updateModel(model);
    this.showPanel('view', model);
  }

  addModel(model: BusModel) {
    this.busService.addModel(model);
    this.showPanel('view', model);
  }

  deleteModel(model: BusModel) {
    this.busService.deleteModel(model.model_id);
    this.showPanel('none');
  }

  clearModelBrandFields() {
    this.newModel.brand = JSON.parse(JSON.stringify(this.blankBrand));
  }

  isFormValid() {
    if (this.newModel.model_name == '' ||
        this.newModel.brand.name == '') {
        return false;
    } else return true;
  }
}
