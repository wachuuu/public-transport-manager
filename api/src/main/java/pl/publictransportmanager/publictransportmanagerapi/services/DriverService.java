package pl.publictransportmanager.publictransportmanagerapi.services;

import pl.publictransportmanager.publictransportmanagerapi.domain.Driver;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;

import java.util.List;

public interface DriverService {

    List<Driver> fetchAllDrivers();

    Driver fetchDriverById(Integer driverId) throws PtmResourceNotFoundException;

    Driver addDriver(String pesel, String name, String surname, String phone_number,
                     String email, String address, Double salary) throws PtmBadRequestException;

    void updateDriver(Integer driverId, Driver driver) throws PtmBadRequestException;

    void removeDriver(Integer driverId) throws PtmResourceNotFoundException;
}
