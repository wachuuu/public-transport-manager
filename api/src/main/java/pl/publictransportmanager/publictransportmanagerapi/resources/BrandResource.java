package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Brand;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.BrandRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/brands")
public class BrandResource {

    @Autowired
    BrandRepository brandRepository;

    @GetMapping("")
    public ResponseEntity<List<Brand>> getAllBrands(){
        List<Brand> brands = brandRepository.findAll();
        return new ResponseEntity<>(brands, HttpStatus.OK);
    }

    @GetMapping("/{brandId}")
    public ResponseEntity<Brand> getBrandById(@PathVariable("brandId") Integer brandId){
        Optional<Brand> brand = brandRepository.findById(brandId);
        if (brand.isPresent())
            return new ResponseEntity<>(brand.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Brand not found");
    }

    @PostMapping("")
    public ResponseEntity<Brand> addBrand(@RequestBody Brand brand){
        try{
            brand.setBrand_id(null);
            return new ResponseEntity<>(brandRepository.save(brand), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{brandId}")
    public ResponseEntity<Brand> updateBrand(@PathVariable("brandId") Integer brandId,
                                             @RequestBody Brand brand){
        if (brandRepository.existsById(brandId)) {
            brand.setBrand_id(brandId);
            try {
                return new ResponseEntity<>(brandRepository.save(brand), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Brand not found");
    }

    @DeleteMapping("/{brandId}")
    public ResponseEntity<Brand> deleteBrand(@PathVariable("brandId") Integer brandId) {
        Optional<Brand> brand = brandRepository.findById(brandId);
        if (brand.isPresent()) {
            brandRepository.delete(brand.get());
            return new ResponseEntity<>(brand.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Brand not found");
    }
}
