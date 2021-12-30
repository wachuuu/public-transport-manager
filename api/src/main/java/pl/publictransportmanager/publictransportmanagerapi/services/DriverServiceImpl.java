package pl.publictransportmanager.publictransportmanagerapi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.publictransportmanager.publictransportmanagerapi.domain.Driver;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.DriverRepository;

import java.util.List;

@Service
@Transactional
public class DriverServiceImpl implements DriverService{

    @Autowired
    DriverRepository driverRepository;

    @Override
    public List<Driver> fetchAllDrivers() {
        return driverRepository.findAll();
    }

    @Override
    public Driver fetchDriverById(Integer driverId) throws PtmResourceNotFoundException {
        return driverRepository.findById(driverId);
    }

    @Override
    public Driver addDriver(String pesel, String name, String surname, String phone_number, String email,
                            String address, Double salary) throws PtmBadRequestException {
        int driverId = driverRepository.create(pesel, name, surname, phone_number, email, address, salary);
        return driverRepository.findById(driverId);
    }

    @Override
    public void updateDriver(Integer driverId, Driver driver) throws PtmBadRequestException {
        driverRepository.update(driverId,driver);
    }

    @Override
    public void removeDriver(Integer driverId) throws PtmResourceNotFoundException {
        driverRepository.removeById(driverId);
    }
}
