package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.ShuttleType;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.ShuttleTypeRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shuttle_types")
public class ShuttleTypeResource {

    @Autowired
    ShuttleTypeRepository shuttleTypeRepository;

    @GetMapping("")
    public ResponseEntity<List<ShuttleType>> getAllShuttleTypes(){
        List<ShuttleType> shuttleTypes = shuttleTypeRepository.findAll();
        return new ResponseEntity<>(shuttleTypes, HttpStatus.OK);
    }

    @GetMapping("/{shuttleTypeId}")
    public ResponseEntity<ShuttleType> getShuttleTypeById(@PathVariable("shuttleTypeId") Integer shuttleTypeId){
        Optional<ShuttleType> shuttleType = shuttleTypeRepository.findById(shuttleTypeId);
        if (shuttleType.isPresent())
            return new ResponseEntity<>(shuttleType.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Shuttle type not found");
    }

    @PostMapping("")
    public ResponseEntity<ShuttleType> addShuttleType(@RequestBody ShuttleType shuttleType){
        try{
            shuttleType.setShuttle_type_id(null);
            return new ResponseEntity<>(shuttleTypeRepository.save(shuttleType), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{shuttleTypeId}")
    public ResponseEntity<ShuttleType> updateShuttleType(@PathVariable("shuttleTypeId") Integer shuttleTypeId,
                                                         @RequestBody ShuttleType shuttleType){
        if (shuttleTypeRepository.existsById(shuttleTypeId)) {
            shuttleType.setShuttle_type_id(shuttleTypeId);
            try {
                return new ResponseEntity<>(shuttleTypeRepository.save(shuttleType), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Shuttle type not found");
    }

    @DeleteMapping("/{shuttleTypeId}")
    public ResponseEntity<ShuttleType> deleteShuttleType(@PathVariable("shuttleTypeId") Integer shuttleTypeId) {
        Optional<ShuttleType> shuttleType = shuttleTypeRepository.findById(shuttleTypeId);
        if (shuttleType.isPresent()) {
            shuttleTypeRepository.delete(shuttleType.get());
            return new ResponseEntity<>(shuttleType.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Shuttle type not found");
    }
}
