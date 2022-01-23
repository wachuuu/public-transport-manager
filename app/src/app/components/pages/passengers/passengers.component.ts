import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Passenger } from 'src/app/models/passenger.model';
import { Ticket } from 'src/app/models/ticket.model';
import { NormalizeStringService } from 'src/app/services/normalize-string.service';
import { PassengersService } from 'src/app/services/passengers.service';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['passenger_id', 'name', 'surname', 'ticket', 'date_of_purchase',
    'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<Passenger>;
  searchFilter = '';
  currentAction: Actions = Actions.None;
  tickets: Ticket[];
  currentPassenger: Passenger;
  newPassenger: Passenger;

  blankPassenger: Passenger = {
    pesel: '',
    name: '',
    surname: '',
    phone_number: '',
    email: '',
    ticket: { ticket_id: null },
    date_of_purchase: null
  };

  constructor(private passengersService: PassengersService, 
    private ticketsService: TicketsService, 
    private s: NormalizeStringService, 
    private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource();
    this.passengersService.passengers$.subscribe((data) => {
      this.dataSource.data = data;
    })

    this.ticketsService.tickets$.subscribe((data) => {
      this.tickets = data
    })

    this.dataSource.filterPredicate = (data, filter) => {
      let matchRow = true;
      let keywords = Array<string>();
      let dataStr = (data.passenger_id ?? '') + " "
        + (data.pesel ?? '') + " "
        + (data.name ?? '') + " "
        + (data.surname ?? '') + " "
        + (data.phone_number ?? '') + " "
        + (data.email ?? '') + " "
        + (data.address ?? '') + " "
        + (data.ticket.name ?? '') + " "
        + (this.datePipe.transform(data.date_of_purchase, 'YYYY-MM-dd') ?? '') + " "
        + (this.datePipe.transform(data.valid_till, 'YYYY-MM-dd') ?? '');
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
    this.passengersService.getPassengers();
    this.ticketsService.getTickets();
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

  showPanel(type: string, ticket?: Passenger) {
    if (ticket) this.currentPassenger = ticket;
    switch (type) {
      case 'none': {
        this.currentAction = Actions.None;
        break;
      }
      case 'add-new': {
        this.currentAction = Actions.AddNew;
        this.ticketsService.getTickets();
        this.newPassenger = JSON.parse(JSON.stringify(this.blankPassenger));
        break;
      }
      case 'view': {
        this.currentAction = Actions.View;
        break;
      }
      case 'edit': {
        this.currentAction = Actions.Edit;
        this.ticketsService.getTickets();
        this.newPassenger = JSON.parse(JSON.stringify(this.currentPassenger));
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
    switch (type) {
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

  editPassenger(passenger: Passenger) {
    this.passengersService.updatePassenger(passenger);
    this.showPanel('view', passenger);
  }

  addPassenger(passenger: Passenger) {
    this.passengersService.addPassenger(passenger);
    this.showPanel('view', passenger);
  }

  deletePassenger(passenger: Passenger) {
    this.passengersService.deletePassenger(passenger.passenger_id);
    this.showPanel('none');
  }

  isFormValid() {
    if (this.newPassenger.name == '' ||
      this.newPassenger.surname == '' ||
      this.newPassenger.pesel == '' ||
      this.newPassenger.phone_number == '' ||
      this.newPassenger.email == '' ||
      this.newPassenger.ticket.ticket_id == null ||
      this.newPassenger.date_of_purchase == null) {
      return false;
    } else return true;
  }
}
