package pl.publictransportmanager.publictransportmanagerapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.publictransportmanager.publictransportmanagerapi.domain.ZoneAffiliation;

@Repository
public interface ZoneAffiliationRepository extends JpaRepository<ZoneAffiliation, Integer> {

}
