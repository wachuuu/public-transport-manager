package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.City;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.CityRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cities")
public class CityResource {

    @Autowired
    CityRepository cityRepository;

    @GetMapping("")
    public ResponseEntity<List<City>> getAllCities(){
        List<City> cities = cityRepository.findAll();
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }

    @GetMapping("/{cityId}")
    public ResponseEntity<City> getCityById(@PathVariable("cityId") Integer cityId){
        Optional<City> city = cityRepository.findById(cityId);
        if (city.isPresent())
            return new ResponseEntity<>(city.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("City not found");
    }

    @PostMapping("")
    public ResponseEntity<City> addCity(@RequestBody City city){
        try{
            city.setCity_id(null);
            return new ResponseEntity<>(cityRepository.save(city), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{cityId}")
    public ResponseEntity<City> updateCity(@PathVariable("cityId") Integer cityId,
                                           @RequestBody City city){
        if (cityRepository.existsById(cityId)) {
            city.setCity_id(cityId);
            try {
                return new ResponseEntity<>(cityRepository.save(city), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("City not found");
    }

    @DeleteMapping("/{cityId}")
    public ResponseEntity<City> deleteCity(@PathVariable("cityId") Integer cityId) {
        Optional<City> city = cityRepository.findById(cityId);
        if (city.isPresent()) {
            cityRepository.delete(city.get());
            return new ResponseEntity<>(city.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("City not found");
    }
}
