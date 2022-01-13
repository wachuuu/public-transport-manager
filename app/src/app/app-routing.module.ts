import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { BusesComponent } from './components/pages/buses/buses.component';
import { DriversComponent } from './components/pages/drivers/drivers.component';
import { ShuttleTypesComponent } from './components/pages/shuttle-types/shuttle-types.component';
import { ZonesAndCitiesComponent } from './components/pages/zones-and-cities/zones-and-cities.component';
import { AuthGuard } from './helpers/auth.guard';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: DriversComponent, canActivate: [AuthGuard] },
  { path: 'zones', component: ZonesAndCitiesComponent, canActivate: [AuthGuard] },
  { path: 'buses', component: BusesComponent, canActivate: [AuthGuard] },
  { path: 'shuttle-types', component: ShuttleTypesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
