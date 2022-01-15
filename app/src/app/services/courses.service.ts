import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }
  readonly url: string = `${environment.apiUrl}/api/courses`;

  private readonly _courses$ = new BehaviorSubject<Course[]>([]);
  readonly courses$ = this._courses$.asObservable();
  get courses() { return this._courses$.getValue(); }
  set courses(value) { this._courses$.next(value); }

  public getCourses() {
    this.http.get<Course[]>(this.url, { observe: 'response' }).subscribe((response) => {
      if (response.ok) this.courses = response.body;
    })
  }

  public getCourseById(course_id: number) {
    this.getCourses();
    return this.courses.find((item) => item.course_id == course_id);
  }

  public addCourse(course: Course) {
    this.http.post<Course>(this.url, course, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.courses = [...this.courses, response.body];
      }
    })
  }

  public updateCourse(course: Course) {
    this.http.put<Course>(`${this.url}/${course.course_id}`, course, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.courses.findIndex((item) => item.course_id == response.body.course_id);
        if (index > -1) {
          this.courses[index] = response.body;
          this._courses$.next(this.courses);
        }
      }
    })
  }

  public deleteCourse(course_id: number) { 
    this.http.delete(`${this.url}/${course_id}`, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        let index = this.courses.findIndex((item) => item.course_id == course_id);
        this.courses.splice(index, 1);
        this._courses$.next(this.courses);
      }
    })
  }
}
