package pl.publictransportmanager.publictransportmanagerapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.publictransportmanager.publictransportmanagerapi.domain.StopOrder;

import java.util.List;

@Repository
public interface StopOrderRepository extends JpaRepository<StopOrder, Integer> {

    List<StopOrder> findAllByLineLineIdOrderByPositionInOrder(Integer line_id);

    List<StopOrder> findAllByStopStopIdOrderByLineLineId(Integer stop_id);

    void deleteByLineLineId(Integer line_id);
}
