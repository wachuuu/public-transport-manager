import { City } from "./city.model";
import { Zone } from "./zone.model";

export interface ZoneAffiliation {
  affiliation_id?: number,
  city?: City,
  zone?: Zone
}
