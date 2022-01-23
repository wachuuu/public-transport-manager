import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Passenger } from 'src/app/models/passenger.model';
import { Ticket } from 'src/app/models/ticket.model';
import { Zone } from 'src/app/models/zone.model';
import { NormalizeStringService } from 'src/app/services/normalize-string.service';
import { PassengersService } from 'src/app/services/passengers.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { ZonesAndCitiesService } from 'src/app/services/zones-and-cities.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['ticket_id', 'name', 'validity_days', 'zone', 'price',
                                'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<Ticket>;
  searchFilter = '';
  currentAction: Actions = Actions.None;
  zones: Zone[];
  passengersForTicket: Passenger[];
  currentTicket: Ticket;
  newTicket: Ticket;

  blankTicket: Ticket = {
    name: '',
    validity_days: null,
    zone: {zone_id: null},
    price: null,
    concessionary: false
  };

  constructor(private ticketsService: TicketsService, 
      private zonesAndCitiesService: ZonesAndCitiesService,
      private s: NormalizeStringService,
      private passengersService: PassengersService) {
    this.dataSource = new MatTableDataSource();
    this.ticketsService.tickets$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.zonesAndCitiesService.zones$.subscribe((data) => {
      this.zones = data;
    })

    this.dataSource.filterPredicate = (data, filter) => {
      let matchRow = true;
      let keywords = Array<string>();
      let dataStr = (data.ticket_id ?? '') + " "
        + (data.name ?? '') + " "
        + (data.validity_days ?? '') + " "
        + (data.zone.symbol ?? '') + " "
        + (data.price ?? '');
      dataStr = this.s.normalize(dataStr.toLowerCase());
      keywords = filter.split(" ");
      keywords.forEach(key => {
        // every keyword should match, otherwise row is rejected
        if (dataStr.indexOf(key) == -1) matchRow = false;
      })
      return matchRow;
    }
  }

  ngOnInit(): void {
    this.ticketsService.getTickets();
    this.zonesAndCitiesService.getZones();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applySearch(searchFilterValue: string) {
    this.dataSource.filter = this.s.normalize(searchFilterValue.toLowerCase());
  }
  
  clearSearch() {
    this.applySearch('');
    this.searchFilter = '';
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
        this.getPassengersForTicket(this.currentTicket.ticket_id)
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

  getPassengersForTicket(ticket_id) {
    this.passengersForTicket = this.passengersService.getPassengersForTicket(ticket_id);
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
