import { Zone } from "./zone.model";

export interface Stop {
  stop_id?: number,
  name?: string,
  interactive_boards?: boolean,
  zone?: Zone
}
