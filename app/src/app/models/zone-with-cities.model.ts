import { City } from "./city.model";
import { Zone } from "./zone.model";

export interface ZoneWithCities {
  zone?: Zone,
  cities?: City[]
}
