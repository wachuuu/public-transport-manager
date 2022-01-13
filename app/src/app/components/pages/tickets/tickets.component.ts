import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Ticket } from 'src/app/models/ticket.model';
import { Zone } from 'src/app/models/zone.model';
import { TicketsService } from 'src/app/services/tickets.service';
import { ZonesAndCitiesService } from 'src/app/services/zones-and-cities.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  displayedColumns: string[] = ['ticket_id', 'name', 'validity_days', 'zone', 'price',
                                'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<Ticket>;
  currentAction: Actions = Actions.None;
  zones: Zone[];
  currentTicket: Ticket;
  newTicket: Ticket;

  blankTicket: Ticket = {
    name: '',
    validity_days: null,
    zone: {zone_id: null},
    price: null,
    concessionary: false
  };

  constructor(private ticketsService: TicketsService, private zonesAndCitiesService: ZonesAndCitiesService) {
    this.dataSource = new MatTableDataSource();
    this.ticketsService.tickets$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.zonesAndCitiesService.zones$.subscribe((data) => {
      this.zones = data;
    })
  }

  ngOnInit(): void {
    this.ticketsService.getTickets();
    this.zonesAndCitiesService.getZones();
  }

  showPanel(type: string, ticket?: Ticket) {
    if (ticket) this.currentTicket = ticket;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.zonesAndCitiesService.getZones();
        this.newTicket = JSON.parse(JSON.stringify(this.blankTicket));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.zonesAndCitiesService.getZones();
        this.newTicket = JSON.parse(JSON.stringify(this.currentTicket));
        break; 
      }
      case 'delete': { 
        this.currentAction = Actions.Delete;
        break; 
      }
      default: { 
        this.currentAction = Actions.None;
        break; 
      } 
    }
  }

  isActivePanel(type: string) {
    switch(type) { 
      case 'none': { 
        if (this.currentAction == Actions.None) 
          return true;
        else return false;
      } 
      case 'add-new': { 
        if (this.currentAction == Actions.AddNew)
          return true;
        else return false;
      }
      case 'view': { 
        if (this.currentAction == Actions.View)
          return true;
        else return false;
      }
      case 'edit': { 
        if (this.currentAction == Actions.Edit)
          return true;
        else return false;
      }
      case 'delete': { 
        if (this.currentAction == Actions.Delete)
          return true;
        else return false;
      }
      default: { 
        return false;
      } 
    }
  }

  editTicket(ticket: Ticket) {
    this.ticketsService.updateTicket(ticket);
    this.showPanel('view', ticket);
  }

  addTicket(ticket: Ticket) {
    this.ticketsService.addTicket(ticket);
    this.showPanel('view', ticket);
  }

  deleteTicket(ticket: Ticket) {
    this.ticketsService.deleteTicket(ticket.ticket_id);
    this.showPanel('none');
  }

  isFormValid() {
    if (this.newTicket.name == '' ||
        this.newTicket.validity_days == null ||
        this.newTicket.validity_days <= 0 ||
        this.newTicket.zone.zone_id == null ||
        this.newTicket.price < 0 ||
        this.newTicket.price == null) {
        return false;
    } else return true;
  }
}
