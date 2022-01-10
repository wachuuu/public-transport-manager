package pl.publictransportmanager.publictransportmanagerapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.publictransportmanager.publictransportmanagerapi.domain.ShuttleType;

@Repository
public interface ShuttleTypeRepository extends JpaRepository<ShuttleType, Integer> {

}
