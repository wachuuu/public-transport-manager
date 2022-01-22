import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Brand } from 'src/app/models/brand.model';
import { BusModel } from 'src/app/models/busModel.model';
import { BusesService } from 'src/app/services/buses.service';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.scss']
})
export class BrandDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['brand_id', 'name', 'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<Brand>;
  currentAction: Actions = Actions.None;
  modelsForBrand: BusModel[];
  currentBrand: Brand;
  newBrand: Brand;

  blankBrand: Brand = {
    name: ''
  };

  constructor(private busService: BusesService) {
    this.dataSource = new MatTableDataSource();
    this.busService.brands$.subscribe((data) => {
      this.dataSource.data = data;
    })
  }

  ngOnInit(): void {
    this.busService.getBrands();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  showPanel(type: string, brand?: Brand) {
    if (brand) this.currentBrand = brand;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.newBrand = JSON.parse(JSON.stringify(this.blankBrand));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.newBrand = JSON.parse(JSON.stringify(this.currentBrand));
        break; 
      }
      case 'delete': { 
        this.currentAction = Actions.Delete;
        this.modelsForBrand = this.busService.getModelsForBrand(this.currentBrand.brand_id);
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

  editBrand(brand: Brand) {
    this.busService.updateBrand(brand);
    this.showPanel('view', brand);
  }

  addBrand(brand: Brand) {
    this.busService.addBrand(brand);
    this.showPanel('view', brand);
  }

  deleteBrand(brand: Brand) {
    this.busService.deleteBrand(brand.brand_id);
    this.showPanel('none');
  }

  isFormValid() {
    if (this.newBrand.name == '') {
        return false;
    } else return true;
  }
}
