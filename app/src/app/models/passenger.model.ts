import { Ticket } from "./ticket.model";

export interface Passenger {
  passenger_id?: number,
  pesel?: string,
  name?: string,
  surname?: string,
  phone_number?: string,
  email?: string,
  address?: string,
  ticket?: Ticket,
  date_of_purchase?: Date
  valid_till?: Date
}
