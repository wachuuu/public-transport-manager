import { BusModel } from "./busModel.model";

export interface Bus {
  bus_id?: number,
  number_plate?: string,
  purchase_date?: Date,
  service_date?: Date,
  monthly_maintenance_cost?: number,
  cost?: number
  bus_model?: BusModel
}
