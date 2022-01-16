import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { LineWithStops } from 'src/app/models/line.model';
import { Stop, StopOrder } from 'src/app/models/stop.model';
import { StopsAndLinesService } from 'src/app/services/stops-and-lines.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit {

  displayedColumns: string[] = ['line_number', 'day_line', 'stops',
    'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<LineWithStops>;
  currentAction: Actions = Actions.None;
  stops: Stop[];
  stopsOrder: StopOrder[];
  showStopPicker: boolean = false;
  currentLine: LineWithStops;
  newLine: LineWithStops;

  blankLine: LineWithStops = {
    line: { line_number: null, lineId: null, day_line: true},
    stops: []
  };

  constructor(private stopsAndLinesService: StopsAndLinesService) {
    this.dataSource = new MatTableDataSource();
    this.stopsAndLinesService.linesWithStops$.subscribe((data) => {
      this.dataSource.data = data;
    })
    this.stopsAndLinesService.stops$.subscribe((data) => {
      this.stops = data;
    })
    this.stopsAndLinesService.stopsOrder$.subscribe((data) => {
      this.stopsOrder = data;
    })
  }

  ngOnInit(): void {
    this.stopsAndLinesService.getLinesWithStops();
    this.stopsAndLinesService.getStops();
    this.stopsAndLinesService.getStopOrders();
  }

  showPanel(type: string, line?: LineWithStops) {
    if (line) this.currentLine = line;
    switch (type) {
      case 'none': {
        this.currentAction = Actions.None;
        break;
      }
      case 'add-new': {
        this.currentAction = Actions.AddNew;
        this.showStopPicker = false;
        this.stopsAndLinesService.getStops();
        this.newLine = JSON.parse(JSON.stringify(this.blankLine));
        break;
      }
      case 'view': {
        this.currentAction = Actions.View;
        break;
      }
      case 'edit': {
        this.currentAction = Actions.Edit;
        this.showStopPicker = false;
        this.stopsAndLinesService.getStops();
        this.newLine = JSON.parse(JSON.stringify(this.currentLine));
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
    switch (type) {
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

  editLine(line: LineWithStops) {
    this.stopsAndLinesService.updateLine(line.line);
    this.stopsAndLinesService.getStopOrders();
    let originalStops = this.currentLine.stops
    let newStops = line.stops

    if (originalStops.length === newStops.length) {
      for (let i = 0; i < originalStops.length; i++) {
        if (originalStops[i].stopId != newStops[i].stopId) {
          this.stopsAndLinesService.updateStopOrder(line.line, originalStops[i], newStops[i], i+1);
        }
      }
    } else if (originalStops.length > newStops.length) { // deleted some stops
      for (let i = 0; i < originalStops.length; i++) {
        if (i < newStops.length) {
          if (originalStops[i].stopId != newStops[i].stopId) {
            this.stopsAndLinesService.updateStopOrder(line.line, originalStops[i], newStops[i], i+1);
          }
        } else {
          this.stopsAndLinesService.deleteStopOrder(line.line, originalStops[i], i+1);
        }
      }
    } else if (originalStops.length < newStops.length) { // added som stops
      for (let i = 0; i < newStops.length; i++) {
        if (i < originalStops.length) {
          if (originalStops[i].stopId != newStops[i].stopId) {
            this.stopsAndLinesService.updateStopOrder(line.line, originalStops[i], newStops[i], i+1);
          }
        } else {
          console.log('add ', i+1, line.line, newStops[i])
          this.stopsAndLinesService.addStopOrder(line.line, newStops[i], i+1);
        }
      }
    }
    this.stopsAndLinesService.getLinesWithStops();
    this.showPanel('view', line);
  }

  addLine(line: LineWithStops) {
    this.stopsAndLinesService.addLine(line);
    this.showPanel('view', line);
  }

  deleteLine(line: LineWithStops) {
    this.stopsAndLinesService.deleteLine(line.line.lineId);
    // TODO: make possible to delete more stops at once.
    // By now please delete only one stop at a time
    this.stopsAndLinesService.getLinesWithStops();
    this.showPanel('none');
  }

  moveUp(line: LineWithStops, stopId: number) {
    let index = line.stops.findIndex(item => item.stopId == stopId);
    if (index == 0) return;
    line.stops.splice(index - 1, 2, line.stops[index], line.stops[index - 1]);
  }

  moveDown(line: LineWithStops, stopId: number) {
    let index = line.stops.findIndex(item => item.stopId == stopId);
    if (index == line.stops.length) return;
    line.stops.splice(index, 2, line.stops[index + 1], line.stops[index]);
  }

  deleteStopFromLine(line: LineWithStops, stopId: number) {
    let index = line.stops.findIndex((item) => item.stopId == stopId);
    line.stops.splice(index, 1);
  }

  showPicker() {
    this.stopsAndLinesService.getStops()
    this.showStopPicker = true;
  }

  addStopToLine(line: LineWithStops, stop: Stop) {
    this.showStopPicker = false;
    line.stops = [...line.stops, stop];
  }

  isFormValid() {
    if (this.newLine.line.line_number == null ||
      this.newLine.line.line_number < 0 ||
      (this.newLine.line.lineId == null &&
      this.dataSource.data.findIndex((item) => item.line.line_number == this.newLine.line.line_number) > -1) ||
      (this.newLine.line.lineId != null &&
      this.dataSource.data.filter((item) => item.line.line_number == this.newLine.line.line_number).length > 1)
    ) {
      return false;
    } else return true;
  }
}
