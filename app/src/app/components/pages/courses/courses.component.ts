import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from 'src/app/models/actions.enum';
import { Bus } from 'src/app/models/bus.model';
import { Course } from 'src/app/models/course.model';
import { Driver } from 'src/app/models/driver.model';
import { Line } from 'src/app/models/line.model';
import { ShuttleType } from 'src/app/models/shuttle-types';
import { BusesService } from 'src/app/services/buses.service';
import { CoursesService } from 'src/app/services/courses.service';
import { DriversService } from 'src/app/services/drivers.service';
import { ShuttleTypesService } from 'src/app/services/shuttle-types.service';
import { StopsAndLinesService } from 'src/app/services/stops-and-lines.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  displayedColumns: string[] = ['course_id', 'line', 'shuttle_type', 'departureTime', 'arrival_time',
    'more', 'edit', 'delete'];
  dataSource: MatTableDataSource<Course>;
  currentAction: Actions = Actions.None;
  lines: Line[];
  buses: Bus[];
  drivers: Driver[];
  shuttleTypes: ShuttleType[];
  currentCourse: Course;
  newCourse: Course;

  blankCourse: Course = {
    line: { lineId: null },
    shuttle_type: { shuttle_type_id: null },
    bus: { bus_id: null },
    driver: { driver_id: null },
    _departureTimeMinutes: 0,
    _departureTimeHours: 0,
    _arrival_timeMinutes: 0,
    _arrival_timeHours: 0
  }

  constructor(
    private coursesService: CoursesService,
    private linesService: StopsAndLinesService,
    private shuttleTypesService: ShuttleTypesService,
    private busesService: BusesService,
    private driversService: DriversService
  ) {
    this.dataSource = new MatTableDataSource();
    this.coursesService.courses$.subscribe((data) => {
      this.dataSource.data = data;
    })
    this.linesService.lines$.subscribe((data) => {
      this.lines = data;
    })
    this.shuttleTypesService.shuttle_types$.subscribe((data) => {
      this.shuttleTypes = data;
    })
    this.busesService.buses$.subscribe((data) => {
      this.buses = data;
    })
    this.driversService.drivers$.subscribe((data) => {
      this.drivers = data;
    })
  }

  ngOnInit(): void {
    this.coursesService.getCourses();
    this.linesService.getLines();
    this.shuttleTypesService.getShuttleTypes();
    this.busesService.getBuses();
    this.driversService.getDrivers();
  }
  showPanel(type: string, course?: Course) {
    if (course) this.currentCourse = course;
    switch(type) { 
      case 'none': { 
        this.currentAction = Actions.None;
        break; 
      } 
      case 'add-new': { 
        this.currentAction = Actions.AddNew;
        this.linesService.getLines();
        this.shuttleTypesService.getShuttleTypes();
        this.busesService.getBuses();
        this.driversService.getDrivers();
        this.newCourse = JSON.parse(JSON.stringify(this.blankCourse));
        break; 
      }
      case 'view': { 
        this.currentAction = Actions.View;
        break; 
      }
      case 'edit': { 
        this.currentAction = Actions.Edit;
        this.linesService.getLines();
        this.shuttleTypesService.getShuttleTypes();
        this.busesService.getBuses();
        this.driversService.getDrivers();
        this.newCourse = this.parseCourseTime(JSON.parse(JSON.stringify(this.currentCourse)));
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

  editCourse(course: Course) {
    this.coursesService.updateCourse(this.writeCourseTime(course));
    this.showPanel('view', course);
  }

  addCourse(course: Course) {
    this.coursesService.addCourse(this.writeCourseTime(course));
    this.showPanel('view', course);
  }

  deleteCourse(course: Course) {
    this.coursesService.deleteCourse(course.course_id);
    this.showPanel('none');
  }

  private writeCourseTime(course: Course) {
    let departure = `${course._departureTimeHours.toString().padStart(2, '0')}:${course._departureTimeMinutes.toString().padStart(2, '0')}`
    let arrival = `${course._arrival_timeHours.toString().padStart(2, '0')}:${course._arrival_timeMinutes.toString().padStart(2, '0')}`

    course.arrival_time = arrival;
    course.departureTime = departure;
    course._arrival_timeHours = null;
    course._arrival_timeMinutes = null;
    course._departureTimeHours = null;
    course._departureTimeMinutes = null;

    return course;
  }

  private parseCourseTime(course: Course) {
    let [depHour, depMinute] = course.departureTime.split(":")
    let [arrHour, arrMinute] = course.arrival_time.split(":")

    course._departureTimeHours = +depHour;
    course._departureTimeMinutes = +depMinute;
    course._arrival_timeHours = +arrHour;
    course._arrival_timeMinutes = +arrMinute;

    return course;
  }

  isFormValid() {
    if (this.newCourse.line.lineId == null ||
        this.newCourse.shuttle_type.shuttle_type_id == null ||
        this.newCourse.bus.bus_id == null ||
        this.newCourse.driver.driver_id == null ||
        this.newCourse._departureTimeMinutes > 60 ||
        this.newCourse._departureTimeMinutes < 0 ||
        this.newCourse._departureTimeHours > 24 ||
        this.newCourse._departureTimeHours < 0 ||
        this.newCourse._arrival_timeMinutes > 60 ||
        this.newCourse._arrival_timeMinutes < 0 ||
        this.newCourse._arrival_timeHours > 24 ||
        this.newCourse._arrival_timeHours < 0 ||
        (this.newCourse._arrival_timeHours < this.newCourse._departureTimeHours) ||
        (this.newCourse._arrival_timeHours == this.newCourse._departureTimeHours &&
        this.newCourse._arrival_timeMinutes <= this.newCourse._departureTimeMinutes)
        ) {
        return false;
    } else return true;
  }
}
