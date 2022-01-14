import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient) { }
  readonly url: string = `${environment.apiUrl}/api/tickets`;

  private readonly _tickets$ = new BehaviorSubject<Ticket[]>([]);
  readonly tickets$ = this._tickets$.asObservable();
  get tickets() { return this._tickets$.getValue(); }
  set tickets(value) { this._tickets$.next(value); }

  public getTickets() {
    this.http.get<Ticket[]>(this.url, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.tickets = response.body;
    })
  }

  public getTicketsForZone(zone_id: number) {
    this.getTickets();
    return this.tickets.filter(item => item.zone.zone_id == zone_id);
  }

  public getTicketById(ticket_id: number) {
    this.getTickets();
    return this.tickets.find((item) => item.ticket_id == ticket_id);
  }

  public addTicket(ticket: Ticket) {
    this.http.post<Ticket>(this.url, ticket, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.tickets = [...this.tickets, response.body];
      }
    })
  }

  public updateTicket(ticket: Ticket) {
    this.http.put<Ticket>(`${this.url}/${ticket.ticket_id}`, ticket, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.tickets.findIndex((item) => item.ticket_id == response.body.ticket_id);
        if (index > -1) {
          this.tickets[index] = response.body;
          this._tickets$.next(this.tickets);
        }
      }
    })
  }

  public deleteTicket(ticket_id: number) { 
    this.http.delete(`${this.url}/${ticket_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.tickets.findIndex((item) => item.ticket_id == ticket_id);
        this.tickets.splice(index);
        this._tickets$.next(this.tickets);
      }
    })
  }
}
