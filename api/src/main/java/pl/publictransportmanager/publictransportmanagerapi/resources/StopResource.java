package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Zone;
import pl.publictransportmanager.publictransportmanagerapi.domain.Stop;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.ZoneRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.StopRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stops")
public class StopResource {

    @Autowired
    StopRepository stopRepository;

    @Autowired
    ZoneRepository zoneRepository;

    @GetMapping("")
    public ResponseEntity<List<Stop>> getAllStops(){
        List<Stop> stops = stopRepository.findAll();
        return new ResponseEntity<>(stops, HttpStatus.OK);
    }

    @GetMapping("/{stopId}")
    public ResponseEntity<Stop> getStopById(@PathVariable("stopId") Integer stopId){
        Optional<Stop> stop = stopRepository.findById(stopId);
        if (stop.isPresent())
            return new ResponseEntity<>(stop.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Stop not found");
    }

    @PostMapping("")
    public ResponseEntity<Stop> addStop(@RequestBody Stop stop){
        stop = checkZone(stop);
        stop.setStop_id(null);
        try{
            return new ResponseEntity<>(stopRepository.save(stop), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{stopId}")
    public ResponseEntity<Stop> updateStop(@PathVariable("stopId") Integer stopId,
                                           @RequestBody Stop stop){
        if (stopRepository.existsById(stopId)){
            stop = checkZone(stop);
            stop.setStop_id(stopId);
            try {
                return new ResponseEntity<>(stopRepository.save(stop), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Stop not found");
    }

    @DeleteMapping("/{stopId}")
    public ResponseEntity<Stop> deleteStop(@PathVariable("stopId") Integer stopId) {
        Optional<Stop> stop = stopRepository.findById(stopId);
        if (stop.isPresent()) {
            stopRepository.delete(stop.get());
            return new ResponseEntity<>(stop.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Stop not found");
    }

    public Stop checkZone(Stop stop) {
        if (stop.getZone().getZone_id() != null) {
            Optional<Zone> zoneFound = zoneRepository.findById(stop.getZone().getZone_id());
            if (zoneFound.isPresent())
                stop.setZone(zoneFound.get());
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                stop.setZone(zoneRepository.save(stop.getZone()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
        return stop;
    }
}
