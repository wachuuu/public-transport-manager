import { Stop } from "./stop.model";

export interface Line {
  lineId?: number,
  line_number?: number,
  day_line?: boolean
}

export interface LineWithStops {
  line: Line,
  stops: Stop[]
}
