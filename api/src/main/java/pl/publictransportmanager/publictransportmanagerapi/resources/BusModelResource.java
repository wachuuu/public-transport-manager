package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Brand;
import pl.publictransportmanager.publictransportmanagerapi.domain.BusModel;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.BrandRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.BusModelRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bus_models")
public class BusModelResource {

    @Autowired
    BusModelRepository busModelRepository;

    @Autowired
    BrandRepository brandRepository;

    @GetMapping("")
    public ResponseEntity<List<BusModel>> getAllBusModels(){
        List<BusModel> busModels = busModelRepository.findAll();
        return new ResponseEntity<>(busModels, HttpStatus.OK);
    }

    @GetMapping("/{busModelId}")
    public ResponseEntity<BusModel> getBusModelById(@PathVariable("busModelId") Integer busModelId){
        Optional<BusModel> busModel = busModelRepository.findById(busModelId);
        if (busModel.isPresent())
            return new ResponseEntity<>(busModel.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Bus model not found");
    }

    @PostMapping("")
    public ResponseEntity<BusModel> addBusModel(@RequestBody BusModel busModel){
        busModel = checkBrand(busModel);
        busModel.setModel_id(null);
        try{
            return new ResponseEntity<>(busModelRepository.save(busModel), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{busModelId}")
    public ResponseEntity<BusModel> updateBusModel(@PathVariable("busModelId") Integer busModelId,
                                                   @RequestBody BusModel busModel){
        if (busModelRepository.existsById(busModelId)){
            busModel = checkBrand(busModel);
            busModel.setModel_id(busModelId);
            try {
                return new ResponseEntity<>(busModelRepository.save(busModel), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Bus model not found");
    }

    @DeleteMapping("/{busModelId}")
    public ResponseEntity<BusModel> deleteBusModel(@PathVariable("busModelId") Integer busModelId) {
        Optional<BusModel> busModel = busModelRepository.findById(busModelId);
        if (busModel.isPresent()) {
            busModelRepository.delete(busModel.get());
            return new ResponseEntity<>(busModel.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Bus model not found");
    }

    public BusModel checkBrand(BusModel busModel) {
        if (busModel.getBrand().getBrand_id() != null) {
            Optional<Brand> brandFound = brandRepository.findById(busModel.getBrand().getBrand_id());
            if (brandFound.isPresent())
                busModel.setBrand(brandFound.get());
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                busModel.setBrand(brandRepository.save(busModel.getBrand()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
        return busModel;
    }
}
