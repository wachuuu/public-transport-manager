package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Zone;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.ZoneRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/zones")
public class ZoneResource {

    @Autowired
    ZoneRepository zoneRepository;

    @GetMapping("")
    public ResponseEntity<List<Zone>> getAllZones(){
        List<Zone> zones = zoneRepository.findAll();
        return new ResponseEntity<>(zones, HttpStatus.OK);
    }

    @GetMapping("/{zoneId}")
    public ResponseEntity<Zone> getZoneById(@PathVariable("zoneId") Integer zoneId){
        Optional<Zone> zone = zoneRepository.findById(zoneId);
        if (zone.isPresent())
            return new ResponseEntity<>(zone.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Zone not found");
    }

    @PostMapping("")
    public ResponseEntity<Zone> addZone(@RequestBody Zone zone){
        try{
            zone.setZone_id(null);
            return new ResponseEntity<>(zoneRepository.save(zone), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{zoneId}")
    public ResponseEntity<Zone> updateZone(@PathVariable("zoneId") Integer zoneId,
                                           @RequestBody Zone zone){
        if (zoneRepository.existsById(zoneId)) {
            zone.setZone_id(zoneId);
            try {
                return new ResponseEntity<>(zoneRepository.save(zone), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Zone not found");
    }

    @DeleteMapping("/{zoneId}")
    public ResponseEntity<Zone> deleteZone(@PathVariable("zoneId") Integer zoneId) {
        Optional<Zone> zone = zoneRepository.findById(zoneId);
        if (zone.isPresent()) {
            zoneRepository.delete(zone.get());
            return new ResponseEntity<>(zone.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Zone not found");
    }
}
