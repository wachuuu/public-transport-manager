import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Stop } from 'src/app/models/stop.model';
import { Zone } from 'src/app/models/zone.model';
import { StopsAndLinesService } from 'src/app/services/stops-and-lines.service';
import { ZonesAndCitiesService } from 'src/app/services/zones-and-cities.service';

@Component({
  selector: 'app-stops',
  templateUrl: './stops.component.html',
  styleUrls: ['./stops.component.scss']
})
export class StopsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['stopId', 'name', 'zone', 'interactive_boards',
    'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<Stop>;
  currentAction: Actions = Actions.None;
  zones: Zone[];
  currentStop: Stop;
  newStop: Stop;

  blankStop: Stop = {
    name: '',
    zone: { zone_id: null },
    interactive_boards: false
  };

  constructor(private stopsAndLinesService: StopsAndLinesService,
    private zonesAndCitiesService: ZonesAndCitiesService) {
    this.dataSource = new MatTableDataSource();
    this.stopsAndLinesService.stops$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.zonesAndCitiesService.zones$.subscribe((data) => {
      this.zones = data;
    })
  }

  ngOnInit(): void {
    this.stopsAndLinesService.getStops();
    this.zonesAndCitiesService.getZones();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  showPanel(type: string, stop?: Stop) {
    if (stop) this.currentStop = stop;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.zonesAndCitiesService.getZones();
        this.newStop = JSON.parse(JSON.stringify(this.blankStop));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.zonesAndCitiesService.getZones();
        this.newStop = JSON.parse(JSON.stringify(this.currentStop));
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

  editStop(stop: Stop) {
    this.stopsAndLinesService.updateStop(stop);
    this.showPanel('view', stop);
  }

  addStop(stop: Stop) {
    this.stopsAndLinesService.addStop(stop);
    this.showPanel('view', stop);
  }

  deleteStop(stop: Stop) {
    this.stopsAndLinesService.deleteStop(stop.stopId);
    this.showPanel('none');
  }

  isFormValid() {
    if (this.newStop.name == '' ||
        this.newStop.zone.zone_id == null) {
        return false;
    } else return true;
  }
}
