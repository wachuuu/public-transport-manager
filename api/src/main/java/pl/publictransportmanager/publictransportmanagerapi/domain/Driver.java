package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Driver {
    private Integer driver_id;
    private String pesel;
    private String name;
    private String surname;
    private String phone_number;
    private String email;
    private String address;
    private Double salary;
}
