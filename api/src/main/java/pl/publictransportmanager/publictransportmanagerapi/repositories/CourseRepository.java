package pl.publictransportmanager.publictransportmanagerapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.publictransportmanager.publictransportmanagerapi.domain.Course;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    List<Course> findAllByLineLineIdOrderByDepartureTime(Integer line_id);
}
