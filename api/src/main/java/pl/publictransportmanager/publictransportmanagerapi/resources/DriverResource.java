package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Driver;
import pl.publictransportmanager.publictransportmanagerapi.services.DriverService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/transport/drivers")
public class DriverResource {

    @Autowired
    DriverService driverService;

    @PostMapping("")
    public ResponseEntity<Driver> addDriver(HttpServletRequest request,
                                            @RequestBody Map<String, Object> driverMap){
        String pesel = (String) driverMap.get("pesel");
        String name = (String) driverMap.get("name");
        String surname = (String) driverMap.get("surname");
        String phone_number = (String) driverMap.get("phone_number");
        String email = (String) driverMap.get("email");
        String address = (String) driverMap.get("address");
        Double salary = (Double) driverMap.get("salary");
        Driver driver = driverService.addDriver(pesel, name, surname, phone_number, email, address, salary);
        return new ResponseEntity<>(driver, HttpStatus.CREATED);
    }
}
