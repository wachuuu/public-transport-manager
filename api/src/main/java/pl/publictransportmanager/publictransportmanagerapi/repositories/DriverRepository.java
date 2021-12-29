package pl.publictransportmanager.publictransportmanagerapi.repositories;

import pl.publictransportmanager.publictransportmanagerapi.domain.Driver;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;

import java.util.List;

public interface DriverRepository {

    List<Driver> findAll() throws PtmResourceNotFoundException;

    Driver findById(Integer driverId) throws PtmResourceNotFoundException;

    Integer create(String pesel, String name, String surname, String phone_number,
                   String email, String address, Double salary) throws PtmBadRequestException;

    void update(Integer driverId, Driver driver) throws PtmBadRequestException;

    void removeById(Integer driverId);
}
