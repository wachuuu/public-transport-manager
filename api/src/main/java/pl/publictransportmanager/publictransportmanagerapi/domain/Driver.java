package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_drivers")
@Setter
@Getter
@ToString
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer driver_id;
    private String pesel;
    private String name;
    private String surname;
    private String phone_number;
    private String email;
    private String address;
    private Double salary;

    public Driver() {}
}
