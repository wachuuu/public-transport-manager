package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Driver;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.DriverRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drivers")
public class DriverResource {

    @Autowired
    DriverRepository driverRepository;

    @GetMapping("")
    public ResponseEntity<List<Driver>> getAllDrivers(){
        List<Driver> drivers = driverRepository.findAll();
        return new ResponseEntity<>(drivers, HttpStatus.OK);
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<Driver> getDriverById(@PathVariable("driverId") Integer driverId){
        Optional<Driver> driver = driverRepository.findById(driverId);
        if (driver.isPresent())
            return new ResponseEntity<>(driver.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Driver not found");
    }

    @PostMapping("")
    public ResponseEntity<Driver> addDriver(@RequestBody Driver driver){
        try{
            driver.setDriver_id(null);
            return new ResponseEntity<>(driverRepository.save(driver), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{driverId}")
    public ResponseEntity<Driver> updateDriver(@PathVariable("driverId") Integer driverId,
                                               @RequestBody Driver driver){
        Optional<Driver> driverFound = driverRepository.findById(driverId);
        if (driverFound.isPresent()) {
            driver.setDriver_id(driverId);
            try{
                return new ResponseEntity<>(driverRepository.save(driver),HttpStatus.OK);
            } catch (Exception e){
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Driver not found");
    }

    @DeleteMapping("/{driverId}")
    public ResponseEntity<Driver> deleteDriver(@PathVariable("driverId") Integer driverId) {
        Optional<Driver> driver = driverRepository.findById(driverId);
        if (driver.isPresent()) {
            driverRepository.delete(driver.get());
            return new ResponseEntity<>(driver.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Driver not found");
    }
}
