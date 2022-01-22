import { Line } from "./line.model";
import { Zone } from "./zone.model";

export interface Stop {
  stopId?: number,
  name?: string,
  interactive_boards?: boolean,
  zone?: Zone
}

export interface StopWithLines {
  stop: Stop,
  lines: Line[],
}

export interface StopOrder {
  id?: number,
  line?: Line,
  stop?: Stop,
  positionInOrder?: number
}
