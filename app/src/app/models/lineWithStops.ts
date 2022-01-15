import { Line } from "./line.model";
import { Stop } from "./stop.model";

export interface LineWithStops {
  line: Line,
  stops: Stop[]
}
