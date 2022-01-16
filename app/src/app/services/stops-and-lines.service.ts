import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Line, LineWithStops } from '../models/line.model';
import { Stop, StopOrder } from '../models/stop.model';

@Injectable({
  providedIn: 'root'
})
export class StopsAndLinesService {

  constructor(private http: HttpClient) { }

  readonly stopsUrl: string = `${environment.apiUrl}/api/stops`;
  readonly stopOrdersUrl: string = `${environment.apiUrl}/api/stops_order`;
  readonly linesUrl: string = `${environment.apiUrl}/api/lines`;

  private readonly _stops$ = new BehaviorSubject<Stop[]>([]);
  readonly stops$ = this._stops$.asObservable();
  get stops() { return this._stops$.getValue(); }
  set stops(value) { this._stops$.next(value); }

  private readonly _stopsOrder$ = new BehaviorSubject<StopOrder[]>([]);
  readonly stopsOrder$ = this._stopsOrder$.asObservable();
  get stopsOrder() { return this._stopsOrder$.getValue(); }
  set stopsOrder(value) { this._stopsOrder$.next(value); }

  private readonly _lines$ = new BehaviorSubject<Line[]>([]);
  readonly lines$ = this._lines$.asObservable();
  get lines() { return this._lines$.getValue(); }
  set lines(value) { this._lines$.next(value); }

  private readonly _linesWithStops$ = new BehaviorSubject<LineWithStops[]>([]);
  readonly linesWithStops$ = this._linesWithStops$.asObservable();
  get linesWithStops() { return this._linesWithStops$.getValue(); }
  set linesWithStops(value) { this._linesWithStops$.next(value); }

  public getStops() {
    this.http.get<Stop[]>(this.stopsUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.stops = response.body;
    })
  }

  public getStopById(stopId: number) {
    this.getStops();
    return this.stops.find((item) => item.stopId == stopId);
  }

  public getStopsForZone(zone_id: number) {
    this.getStops();
    return this.stops.filter(item => item.zone.zone_id == zone_id);
  }

  public addStop(stop: Stop) {
    this.http.post<Stop>(this.stopsUrl, stop, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.stops = [...this.stops, response.body];
      }
    })
  }

  public updateStop(stop: Stop) {
    this.http.put<Stop>(`${this.stopsUrl}/${stop.stopId}`, stop, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.stops.findIndex((item) => item.stopId == response.body.stopId);
        if (index > -1) {
          this.stops[index] = response.body;
          this._stops$.next(this.stops);
        }
      }
    })
  }

  public deleteStop(stopId: number) {
    this.http.delete(`${this.stopsUrl}/${stopId}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.stops.findIndex((item) => item.stopId == stopId);
        this.stops.splice(index, 1);
        this._stops$.next(this.stops);
      }
    })
  }

  public getLines() {
    this.http.get<Line[]>(this.linesUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.lines = response.body;
    })
  }

  public getLineById(lineId: number) {
    this.getLines();
    return this.lines.find((item) => item.lineId == lineId);
  }

  public addLine(line: LineWithStops) {
    this.http.post<Line>(this.linesUrl, line.line, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.lines = [...this.lines, response.body];
        if (line.stops.length == 0) this.getLinesWithStops();
        line.stops.forEach((stop, index) => {
          console.log('add ', index+1, line.line, stop)
          this.addStopOrder(response.body, stop, index+1)
        })
      }
    })
    this.getLinesWithStops();
  }

  public updateLine(line: Line) {
    this.http.put<Line>(`${this.linesUrl}/${line.lineId}`, line, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.lines.findIndex((item) => item.lineId == response.body.lineId);
        if (index > -1) {
          this.lines[index] = response.body;
          this._lines$.next(this.lines);
        }
      }
    })
  }

  public deleteLine(lineId: number) {
    this.http.delete(`${this.linesUrl}/${lineId}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.lines.findIndex((item) => item.lineId == lineId);
        this.lines.splice(index, 1);
        this._lines$.next(this.lines);
      }
    })
  }

  public getLinesWithStops() {
    let linesToProcess: Line[];
    this.linesWithStops = [];
    this.http.get<Line[]>(this.linesUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        linesToProcess = response.body;
        linesToProcess.forEach((line) => {
          this.getLineWithStops(line.lineId);
        })
      }
    })
  }

  private getLineWithStops(lineId: number) {
    this.http.get<LineWithStops>(`${this.stopOrdersUrl}/line_list/${lineId}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.linesWithStops = [response.body, ...this.linesWithStops];
        this.linesWithStops.sort((a, b) => a.line.line_number - b.line.line_number)
        this._linesWithStops$.next(this.linesWithStops);
      }
    })
  }

  public getStopOrders() {
    this.http.get<StopOrder[]>(this.stopOrdersUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.stopsOrder = response.body;
    })
  }

  public updateStopOrder(line: Line, oldStop: Stop, newStop: Stop, position: number) {
    this.getStopOrders();
    let payload = this.stopsOrder.find((item) => (item.line.lineId == line.lineId && item.stop.stopId == oldStop.stopId && item.positionInOrder == position));
    console.log(payload);
    payload.stop = newStop;
    this.http.put<StopOrder>(`${this.stopOrdersUrl}/${payload.id}`, payload, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.stopsOrder.findIndex((item) => item.id == response.body.id);
        if (index > -1) {
          this.stopsOrder[index] = response.body;
          this._stopsOrder$.next(this.stopsOrder);
        }
      }
    })
  }

  public addStopOrder(_line: Line, _stop: Stop, _positionInOrder: number) {
    let payload: StopOrder = {
      line: _line,
      stop: _stop,
      positionInOrder: _positionInOrder
    };
    this.http.post<StopOrder>(this.stopOrdersUrl, payload, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.stopsOrder = [...this.stopsOrder, response.body];
      }
    })
  }

  public deleteStopOrder(_line: Line, _stop: Stop, _positionInOrder: number) {
    this.getStopOrders();
    console.log(this.stopsOrder, _line, _stop, _positionInOrder);
    let deletedStopOrder = this.stopsOrder.find((item) => item.line.lineId == _line.lineId && item.stop.stopId == _stop.stopId && item.positionInOrder == _positionInOrder);
    console.log(deletedStopOrder)
    this.http.delete(`${this.stopOrdersUrl}/${deletedStopOrder.id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.stopsOrder.findIndex((item) => item.id == deletedStopOrder.id);
        this.stopsOrder.splice(index, 1);
        this._stopsOrder$.next(this.stopsOrder);
      }
    })
  }
}
