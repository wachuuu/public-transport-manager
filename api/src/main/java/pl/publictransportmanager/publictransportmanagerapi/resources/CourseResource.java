package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.*;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseResource {

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    DriverRepository driverRepository;

    @Autowired
    LineRepository lineRepository;

    @Autowired
    ShuttleTypeRepository shuttleTypeRepository;

    @Autowired
    BusRepository busRepository;

    @Autowired
    BusResource busResource;

    @GetMapping("")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable("courseId") Integer courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isPresent())
            return new ResponseEntity<>(course.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Course not found");
    }

    @GetMapping("/line/{line_id}")
    public ResponseEntity<List<Course>> getStopOrderByLine(@PathVariable("line_id") Integer line_id) {
        List<Course> courses = courseRepository.findAllByLineLineIdOrderByDepartureTime(line_id);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        try {
            checkDriver(course);
            checkLine(course);
            checkShuttleType(course);
            checkBus(course);
            course.setCourse_id(null);
            return new ResponseEntity<>(courseRepository.save(course), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<Course> updateCourse(@PathVariable("courseId") Integer courseId,
                                               @RequestBody Course course) {
        if (courseRepository.existsById(courseId)) {
            try {
                checkDriver(course);
                checkLine(course);
                checkShuttleType(course);
                checkBus(course);
                course.setCourse_id(courseId);
                return new ResponseEntity<>(courseRepository.save(course), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Course not found");
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Course> deleteStop(@PathVariable("courseId") Integer courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isPresent()) {
            courseRepository.delete(course.get());
            return new ResponseEntity<>(course.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Course not found");
    }

    public void checkDriver(Course course) {
        if (course.getDriver().getDriver_id() != null) {
            Optional<Driver> driverFound = driverRepository.findById(course.getDriver().getDriver_id());
            if (driverFound.isPresent())
                course.setDriver(driverFound.get());
            else
                throw new PtmBadRequestException("Invalid request");
        } else {
            try {
                course.setDriver(driverRepository.save(course.getDriver()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }

    public void checkLine(Course course) {
        if (course.getLine().getLineId() != null) {
            Optional<Line> lineFound = lineRepository.findById(course.getLine().getLineId());
            if (lineFound.isPresent())
                course.setLine(lineFound.get());
            else
                throw new PtmBadRequestException("Invalid request");
        } else {
            try {
                course.setLine(lineRepository.save(course.getLine()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }

    public void checkShuttleType(Course course) {
        if (course.getShuttle_type().getShuttle_type_id() != null) {
            Optional<ShuttleType> shuttleTypeFound = shuttleTypeRepository.
                    findById(course.getShuttle_type().getShuttle_type_id());
            if (shuttleTypeFound.isPresent())
                course.setShuttle_type(shuttleTypeFound.get());
            else
                throw new PtmBadRequestException("Invalid request");
        } else {
            try {
                course.setShuttle_type(shuttleTypeRepository.save(course.getShuttle_type()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }

    public void checkBus(Course course) {
        if (course.getBus().getBus_id() != null) {
            Optional<Bus> busFound = busRepository.findById(course.getBus().getBus_id());
            if (busFound.isPresent())
                course.setBus(busFound.get());
            else
                throw new PtmBadRequestException("Invalid request");
        } else {
            try {
                course.setBus(busRepository.save(busResource.checkBusModel(course.getBus())));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }
}