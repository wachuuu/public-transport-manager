import { Zone } from "./zone.model";

export interface Ticket {
  ticket_id?: number,
  name?: string,
  validity_days?: number,
  zone?: Zone
  price?: number,
  concessionary?: boolean
}
