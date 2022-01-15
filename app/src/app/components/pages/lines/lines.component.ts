import { Component, OnInit } from '@angular/core';
import { StopsAndLinesService } from 'src/app/services/stops-and-lines.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit {

  constructor(private stopsAndLinesService: StopsAndLinesService) { }

  ngOnInit(): void {
  }

  test() {
    this.stopsAndLinesService.getLinesWithStops();
  }

}
