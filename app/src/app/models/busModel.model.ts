import { Brand } from "./brand.model";

export interface BusModel {
  model_id?: number,
  model_name?: string,
  year_of_production?: number,
  number_of_seats?: number
  brand?: Brand
}
