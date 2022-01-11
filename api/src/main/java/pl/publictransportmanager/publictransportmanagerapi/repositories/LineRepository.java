package pl.publictransportmanager.publictransportmanagerapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.publictransportmanager.publictransportmanagerapi.domain.Line;

@Repository
public interface LineRepository extends JpaRepository<Line, Integer> {

}
