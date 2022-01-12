package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Bus;
import pl.publictransportmanager.publictransportmanagerapi.domain.BusModel;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.BusModelRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.BusRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/buses")
public class BusResource {

    @Autowired
    BusRepository busRepository;

    @Autowired
    BusModelRepository busModelRepository;

    @Autowired
    BusModelResource busModelResource;

    @GetMapping("")
    public ResponseEntity<List<Bus>> getAllBuses(){
        List<Bus> buses = busRepository.findAll();
        return new ResponseEntity<>(buses, HttpStatus.OK);
    }

    @GetMapping("/{busId}")
    public ResponseEntity<Bus> getBusById(@PathVariable("busId") Integer busId){
        Optional<Bus> bus = busRepository.findById(busId);
        if (bus.isPresent())
            return new ResponseEntity<>(bus.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Bus not found");
    }

    @PostMapping("")
    public ResponseEntity<Bus> addBus(@RequestBody Bus bus){
        checkBusModel(bus);
        bus.setBus_id(null);
        try{
            return new ResponseEntity<>(busRepository.save(bus), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{busId}")
    public ResponseEntity<Bus> updateBus(@PathVariable("busId") Integer busId,
                                         @RequestBody Bus bus){
        if (busRepository.existsById(busId)){
            checkBusModel(bus);
            bus.setBus_id(busId);
            try{
                return new ResponseEntity<>(busRepository.save(bus), HttpStatus.OK);
            } catch (Exception e){
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Bus not found");
    }

    @DeleteMapping("/{busId}")
    public ResponseEntity<Bus> deleteBus(@PathVariable("busId") Integer busId) {
        Optional<Bus> bus = busRepository.findById(busId);
        if (bus.isPresent()) {
            busRepository.delete(bus.get());
            return new ResponseEntity<>(bus.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Bus not found");
    }

    public Bus checkBusModel(Bus bus) {
        if (bus.getBus_model().getModel_id() != null) {
            Optional<BusModel> busModelFound = busModelRepository.findById(bus.getBus_model().getModel_id());
            if (busModelFound.isPresent()){
                bus.setBus_model(busModelFound.get());
            }
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                bus.setBus_model(busModelRepository.save(busModelResource.checkBrand(bus.getBus_model())));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
        return bus;
    }
}
