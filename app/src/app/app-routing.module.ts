import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { BusesComponent } from './components/pages/buses/buses.component';
import { CoursesComponent } from './components/pages/courses/courses.component';
import { DriversComponent } from './components/pages/drivers/drivers.component';
import { LinesComponent } from './components/pages/lines/lines.component';
import { PassengersComponent } from './components/pages/passengers/passengers.component';
import { ShuttleTypesComponent } from './components/pages/shuttle-types/shuttle-types.component';
import { StopsComponent } from './components/pages/stops/stops.component';
import { TicketsComponent } from './components/pages/tickets/tickets.component';
import { ZonesAndCitiesComponent } from './components/pages/zones-and-cities/zones-and-cities.component';
import { AuthGuard } from './helpers/auth.guard';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: DriversComponent, canActivate: [AuthGuard] },
  { path: 'buses', component: BusesComponent, canActivate: [AuthGuard] },
  { path: 'zones', component: ZonesAndCitiesComponent, canActivate: [AuthGuard] },
  { path: 'shuttle-types', component: ShuttleTypesComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard] },
  { path: 'passengers', component: PassengersComponent, canActivate: [AuthGuard] },
  { path: 'stops', component: StopsComponent, canActivate: [AuthGuard] },
  { path: 'lines', component: LinesComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
