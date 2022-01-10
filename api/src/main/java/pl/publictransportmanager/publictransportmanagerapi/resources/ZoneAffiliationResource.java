package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.*;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.ZoneRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.ZoneAffiliationRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.CityRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/zone_affiliations")
public class ZoneAffiliationResource {

    @Autowired
    ZoneAffiliationRepository zoneAffiliationRepository;

    @Autowired
    ZoneRepository zoneRepository;

    @Autowired
    CityRepository cityRepository;

    @GetMapping("")
    public ResponseEntity<List<ZoneAffiliation>> getAllZoneAffiliations(){
        List<ZoneAffiliation> zoneAffiliations = zoneAffiliationRepository.findAll();
        return new ResponseEntity<>(zoneAffiliations, HttpStatus.OK);
    }

    @GetMapping("/{affiliationId}")
    public ResponseEntity<ZoneAffiliation> getZoneAffiliationById(@PathVariable("affiliationId") Integer affiliationId){
        Optional<ZoneAffiliation> zoneAffiliation = zoneAffiliationRepository.findById(affiliationId);
        if (zoneAffiliation.isPresent())
            return new ResponseEntity<>(zoneAffiliation.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Zone affiliation not found");
    }

    @PostMapping("")
    public ResponseEntity<ZoneAffiliation> addZoneAffiliation(@RequestBody ZoneAffiliation zoneAffiliation){
        zoneAffiliation = checkCity(zoneAffiliation);
        zoneAffiliation = checkZone(zoneAffiliation);
        zoneAffiliation.setAffiliation_id(null);
        try{
            return new ResponseEntity<>(zoneAffiliationRepository.save(zoneAffiliation), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{affiliationId}")
    public ResponseEntity<ZoneAffiliation> updateZoneAffiliation(@PathVariable("affiliationId") Integer affiliationId,
                                                                 @RequestBody ZoneAffiliation zoneAffiliation){
        if (zoneAffiliationRepository.existsById(affiliationId)){
            zoneAffiliation = checkCity(zoneAffiliation);
            zoneAffiliation = checkZone(zoneAffiliation);
            zoneAffiliation.setAffiliation_id(affiliationId);
            try {
                return new ResponseEntity<>(zoneAffiliationRepository.save(zoneAffiliation), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Zone affiliation not found");
    }

    @DeleteMapping("/{affiliationId}")
    public ResponseEntity<ZoneAffiliation> deleteZoneAffiliation(@PathVariable("affiliationId") Integer affiliationId) {
        Optional<ZoneAffiliation> zoneAffiliation = zoneAffiliationRepository.findById(affiliationId);
        if (zoneAffiliation.isPresent()) {
            zoneAffiliationRepository.delete(zoneAffiliation.get());
            return new ResponseEntity<>(zoneAffiliation.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Zone affiliation not found");
    }

    public ZoneAffiliation checkCity(ZoneAffiliation zoneAffiliation) {
        if (zoneAffiliation.getCity().getCity_id() != null) {
            Optional<City> cityFound = cityRepository.findById(zoneAffiliation.getCity().getCity_id());
            if (cityFound.isPresent())
                zoneAffiliation.setCity(cityFound.get());
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                zoneAffiliation.setCity(cityRepository.save(zoneAffiliation.getCity()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
        return zoneAffiliation;
    }

    public ZoneAffiliation checkZone(ZoneAffiliation zoneAffiliation) {
        if (zoneAffiliation.getZone().getZone_id() != null) {
            Optional<Zone> zoneFound = zoneRepository.findById(zoneAffiliation.getZone().getZone_id());
            if (zoneFound.isPresent())
                zoneAffiliation.setZone(zoneFound.get());
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                zoneAffiliation.setZone(zoneRepository.save(zoneAffiliation.getZone()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
        return zoneAffiliation;
    }
}
