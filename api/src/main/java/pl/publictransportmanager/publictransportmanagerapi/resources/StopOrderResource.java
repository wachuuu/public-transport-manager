package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.*;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.StopRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.StopOrderRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.LineRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stops_order")
public class StopOrderResource {

    @Autowired
    StopOrderRepository stopOrderRepository;

    @Autowired
    StopRepository stopRepository;

    @Autowired
    StopResource stopResource;

    @Autowired
    LineRepository lineRepository;

    @GetMapping("")
    public ResponseEntity<List<StopOrder>> getAllStopsOrder(){
        List<StopOrder> stopOrders = stopOrderRepository.findAll();
        return new ResponseEntity<>(stopOrders, HttpStatus.OK);
    }

    @GetMapping("/{stopOrderId}")
    public ResponseEntity<StopOrder> getStopOrderById(@PathVariable("stopOrderId") Integer stopOrderId){
        Optional<StopOrder> stopOrder = stopOrderRepository.findById(stopOrderId);
        if (stopOrder.isPresent())
            return new ResponseEntity<>(stopOrder.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Stop order not found");
    }

    @GetMapping("/line/{line_number}")
    public ResponseEntity<List<StopOrder>> getStopOrderByLine(@PathVariable("line_number") Integer line_number){
        List<StopOrder> stopOrders = stopOrderRepository.findAllByLineLineNumberOrderByPositionInOrder(line_number);
        return new ResponseEntity<>(stopOrders, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<StopOrder> addStopOrder(@RequestBody StopOrder stopOrder){
        checkStop(stopOrder);
        checkLine(stopOrder);
        stopOrder.setId(null);
        try{
            StopOrder s = stopOrderRepository.save(stopOrder);
            List<StopOrder> stopOrders = stopOrderRepository.
                    findAllByLineLineNumberOrderByPositionInOrder(s.getLine().getLineNumber());
            for (StopOrder i : stopOrders){
                if (i.getPositionInOrder() >= s.getPositionInOrder() && i!=s){
                    i.setPositionInOrder(i.getPositionInOrder()+1);
                    stopOrderRepository.save(i);
                }
            }
            return new ResponseEntity<>(s, HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{stopOrderId}")
    public ResponseEntity<StopOrder> updateStopOrder(@PathVariable("stopOrderId") Integer stopOrderId,
                                                     @RequestBody StopOrder stopOrder){
        Optional<StopOrder> stopOrderFound = stopOrderRepository.findById(stopOrderId);
        if (stopOrderFound.isPresent()) {
            checkStop(stopOrder);
            checkLine(stopOrder);
            stopOrder.setId(stopOrderId);
            Integer oldPos = stopOrderFound.get().getPositionInOrder();
            try {
                StopOrder s = stopOrderRepository.save(stopOrder);
                List<StopOrder> stopOrders = stopOrderRepository.
                        findAllByLineLineNumberOrderByPositionInOrder(s.getLine().getLineNumber());
                if (oldPos > s.getPositionInOrder()){
                    for (StopOrder i : stopOrders){
                        if (i.getPositionInOrder() >= s.getPositionInOrder() &&
                                i.getPositionInOrder() < oldPos && i!=s){
                            i.setPositionInOrder(i.getPositionInOrder()+1);
                            stopOrderRepository.save(i);
                        }
                    }
                } else if (oldPos < s.getPositionInOrder()){
                    for (StopOrder i : stopOrders){
                        if (i.getPositionInOrder() <= s.getPositionInOrder() &&
                                i.getPositionInOrder() > oldPos && i!=s){
                            i.setPositionInOrder(i.getPositionInOrder()-1);
                            stopOrderRepository.save(i);
                        }
                    }
                }
                return new ResponseEntity<>(s, HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Stop order not found");
    }

    @DeleteMapping("/{stopOrderId}")
    public ResponseEntity<StopOrder> deleteStopOrder(@PathVariable("stopOrderId") Integer stopOrderId) {
        Optional<StopOrder> stopOrder = stopOrderRepository.findById(stopOrderId);
        if (stopOrder.isPresent()) {
            stopOrderRepository.delete(stopOrder.get());
            return new ResponseEntity<>(stopOrder.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Stop order not found");
    }

    public void checkStop(StopOrder stopOrder) {
        if (stopOrder.getStop().getStop_id() != null) {
            Optional<Stop> stopFound = stopRepository.findById(stopOrder.getStop().getStop_id());
            if (stopFound.isPresent())
                stopOrder.setStop(stopFound.get());
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                stopOrder.setStop(stopRepository.save(stopResource.checkZone(stopOrder.getStop())));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }

    public void checkLine(StopOrder stopOrder) {
        if (stopOrder.getLine().getLineNumber() != null) {
            Optional<Line> lineFound = lineRepository.findById(stopOrder.getLine().getLineNumber());
            if (lineFound.isPresent())
                stopOrder.setLine(lineFound.get());
            else {
                try {
                    stopOrder.setLine(lineRepository.save(stopOrder.getLine()));
                } catch (Exception e) {
                    throw new PtmBadRequestException("Invalid request");
                }
            }
        } else
            throw new PtmBadRequestException("Invalid request");
    }
}
