import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { ShuttleType } from 'src/app/models/shuttle-types';
import { NormalizeStringService } from 'src/app/services/normalize-string.service';
import { ShuttleTypesService } from 'src/app/services/shuttle-types.service';

@Component({
  selector: 'app-shuttle-types',
  templateUrl: './shuttle-types.component.html',
  styleUrls: ['./shuttle-types.component.scss']
})
export class ShuttleTypesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['shuttle_type_id', 'type', 'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<ShuttleType>;
  searchFilter = '';
  currentAction: Actions = Actions.None;
  currentType: ShuttleType;
  newType: ShuttleType;

  blankType: ShuttleType = {
    type: ''
  };

  constructor(private shuttleTypesService: ShuttleTypesService, private s: NormalizeStringService) {
    this.dataSource = new MatTableDataSource();
    this.shuttleTypesService.shuttle_types$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.dataSource.filterPredicate = (data, filter) => {
      let matchRow = true;
      let keywords = Array<string>();
      let dataStr = (data.shuttle_type_id ?? '') + " "
        + (data.type ?? '');
      dataStr = this.s.normalize(dataStr.toLowerCase());
      keywords = filter.split(" ");
      keywords.forEach(key => {
        // every keyword should match, otherwise row is rejected
        if (dataStr.indexOf(key) == -1) matchRow = false;
      })
      return matchRow;
    }
  }

  ngOnInit(): void {
    this.shuttleTypesService.getShuttleTypes();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applySearch(searchFilterValue: string) {
    this.dataSource.filter = this.s.normalize(searchFilterValue.toLowerCase());
  }
  
  clearSearch() {
    this.applySearch('');
    this.searchFilter = '';
  }

  showPanel(type: string, shuttleType?: ShuttleType) {
    if (shuttleType) this.currentType = shuttleType;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.newType = JSON.parse(JSON.stringify(this.blankType));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.newType = JSON.parse(JSON.stringify(this.currentType));
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

  editShuttleType(shuttleType: ShuttleType) {
    this.shuttleTypesService.updateShuttleType(shuttleType);
    this.showPanel('view', shuttleType);
  }

  addShuttleType(shuttleType: ShuttleType) {
    this.shuttleTypesService.addShuttleType(shuttleType);
    this.showPanel('view', shuttleType);
  }

  deleteShuttleType(shuttleType: ShuttleType) {
    this.shuttleTypesService.deleteShuttleType(shuttleType.shuttle_type_id);
    this.showPanel('none');
  }

  isFormValid() {
    if (this.newType.type == '') {
        return false;
    } else return true;
  }

}
