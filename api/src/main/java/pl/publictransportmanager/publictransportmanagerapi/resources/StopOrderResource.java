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

import java.util.*;

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
        Optional<Line> lineFound = lineRepository.findById(line_number);
        if (lineFound.isPresent()) {
            List<StopOrder> stopOrders = stopOrderRepository.findAllByLineLineIdOrderByPositionInOrder(line_number);
            return new ResponseEntity<>(stopOrders, HttpStatus.OK);
        }
        throw new PtmResourceNotFoundException("Stop order not found");
    }

    @GetMapping("/line_list/{line_id}")
    public ResponseEntity<Map<String,Object>> getStopsByLine(@PathVariable("line_id") Integer line_id){
        Optional<Line> lineFound = lineRepository.findById(line_id);
        if (lineFound.isPresent()){
            List<StopOrder> stopOrders = stopOrderRepository.findAllByLineLineIdOrderByPositionInOrder(line_id);
            Map<String,Object> result = new HashMap<>();
            result.put("line",lineFound.get());
            List<Stop> stops = new Vector<>();
            for (StopOrder i : stopOrders)
                stops.add(i.getStop());
            result.put("stops",stops);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        throw new PtmResourceNotFoundException("Line not found");
    }

    @GetMapping("/stop_list/{stop_id}")
    public ResponseEntity<Map<String,Object>> getLinesByStop(@PathVariable("stop_id") Integer stop_id){
        Optional<Stop> stopFound = stopRepository.findById(stop_id);
        if (stopFound.isPresent()){
            List<StopOrder> stopOrders = stopOrderRepository.findAllByStopStopIdOrderByLineLineId(stop_id);
            Map<String,Object> result = new HashMap<>();
            result.put("stop",stopFound.get());
            List<Line> lines = new Vector<>();
            for (StopOrder i : stopOrders)
                lines.add(i.getLine());
            result.put("lines",lines);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        throw new PtmResourceNotFoundException("Line not found");
    }

    @PostMapping("")
    public ResponseEntity<StopOrder> addStopOrder(@RequestBody StopOrder stopOrder){
        checkStop(stopOrder);
        checkLine(stopOrder);
        stopOrder.setId(null);
        try{
            StopOrder s = stopOrderRepository.save(stopOrder);
            List<StopOrder> stopOrders = stopOrderRepository.
                    findAllByLineLineIdOrderByPositionInOrder(s.getLine().getLineId());
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
                        findAllByLineLineIdOrderByPositionInOrder(s.getLine().getLineId());
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
        if (stopOrder.getStop().getStopId() != null) {
            Optional<Stop> stopFound = stopRepository.findById(stopOrder.getStop().getStopId());
            if (stopFound.isPresent())
                stopOrder.setStop(stopFound.get());
            else
                throw new PtmBadRequestException("Invalid request");
        } else {
            try {
                stopOrder.setStop(stopRepository.save(stopResource.checkZone(stopOrder.getStop())));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }

    public void checkLine(StopOrder stopOrder) {
        if (stopOrder.getLine().getLineId() != null) {
            Optional<Line> lineFound = lineRepository.findById(stopOrder.getLine().getLineId());
            if (lineFound.isPresent())
                stopOrder.setLine(lineFound.get());
            else
                throw new PtmBadRequestException("Invalid request");
        } else {
            try {
                stopOrder.setLine(lineRepository.save(stopOrder.getLine()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }
}
