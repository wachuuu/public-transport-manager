import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { LineWithStops } from 'src/app/models/line.model';
import { Stop } from 'src/app/models/stop.model';
import { NormalizeStringService } from 'src/app/services/normalize-string.service';
import { StopsAndLinesService } from 'src/app/services/stops-and-lines.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['line_number', 'day_line', 'stops',
    'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<LineWithStops>;
  searchFilter = '';
  currentAction: Actions = Actions.None;
  stops: Stop[];
  showStopPicker: boolean = false;
  currentLine: LineWithStops;
  newLine: LineWithStops;

  blankLine: LineWithStops = {
    line: { line_number: null, lineId: null, day_line: true},
    stops: []
  };

  constructor(private stopsAndLinesService: StopsAndLinesService, private s: NormalizeStringService) {
    this.dataSource = new MatTableDataSource();
    this.stopsAndLinesService.linesWithStops$.subscribe((data) => {
      this.dataSource.data = data;
    })
    this.stopsAndLinesService.stops$.subscribe((data) => {
      this.stops = data;
    })

    this.dataSource.filterPredicate = (data, filter) => {
      let matchRow = true;
      let keywords = Array<string>();
      let dataStr = "id=" + (data.line.line_number ?? '') + " ";
      if (data.line.day_line) dataStr += "day line";
      else dataStr += "night line";
      data.stops.forEach(stop => {
        dataStr += ((stop.name ?? '') + " ")
      })
      dataStr = this.s.normalize(dataStr.toLowerCase());
      keywords = filter.split(" ");
      keywords.forEach(key => {
        if (dataStr.indexOf(key) == -1) matchRow = false;
      })
      return matchRow;
    }

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'line_number': return item.line.line_number;
        case 'day_line': return item.line.day_line ? 'D' : 'N';
        default: return item[property];
      }
    }
  }

  ngOnInit(): void {
    this.stopsAndLinesService.getLinesWithStops();
    this.stopsAndLinesService.getStops();
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
    this.stopsAndLinesService.updateLine(line);
    this.showPanel('view', line);
  }

  addLine(line: LineWithStops) {
    this.stopsAndLinesService.addLine(line);
    this.showPanel('view', line);
  }

  deleteLine(line: LineWithStops) {
    this.stopsAndLinesService.deleteLine(line.line.lineId);
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

  addStopToLine(line: LineWithStops, stop: Stop) {
    this.showStopPicker = false;
    line.stops = [...line.stops, stop];
  }

  showPicker() {
    this.stopsAndLinesService.getStops()
    this.showStopPicker = true;
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
