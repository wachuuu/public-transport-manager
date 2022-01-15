import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { BrandDetailsComponent } from './components/pages/buses/brand-details/brand-details.component';
import { BusDetailsComponent } from './components/pages/buses/bus-details/bus-details.component';
import { BusModelDetailsComponent } from './components/pages/buses/bus-model-details/bus-model-details.component';
import { BusesComponent } from './components/pages/buses/buses.component';
import { CoursesComponent } from './components/pages/courses/courses.component';
import { DriversComponent } from './components/pages/drivers/drivers.component';
import { LinesComponent } from './components/pages/lines/lines.component';
import { PassengersComponent } from './components/pages/passengers/passengers.component';
import { ShuttleTypesComponent } from './components/pages/shuttle-types/shuttle-types.component';
import { StopsComponent } from './components/pages/stops/stops.component';
import { TicketsComponent } from './components/pages/tickets/tickets.component';
import { CitiesComponent } from './components/pages/zones-and-cities/cities/cities.component';
import { ZonesAndCitiesComponent } from './components/pages/zones-and-cities/zones-and-cities.component';
import { ZonesComponent } from './components/pages/zones-and-cities/zones/zones.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DriversComponent,
    BusesComponent,
    BusDetailsComponent,
    BrandDetailsComponent,
    BusModelDetailsComponent,
    ZonesAndCitiesComponent,
    ZonesComponent,
    CitiesComponent,
    ShuttleTypesComponent,
    PassengersComponent,
    TicketsComponent,
    StopsComponent,
    LinesComponent,
    CoursesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
