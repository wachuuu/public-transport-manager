import { Bus } from "./bus.model";
import { Driver } from "./driver.model";
import { Line } from "./line.model";
import { ShuttleType } from "./shuttle-types";

export interface Course {
  course_id?: number,
  line: Line,
  shuttle_type: ShuttleType,
  bus: Bus,
  driver: Driver,
  departureTime?: string,
  arrival_time?: string,
  _departureTimeMinutes?: number,
  _departureTimeHours?: number,
  _arrival_timeMinutes?: number,
  _arrival_timeHours?: number
}
