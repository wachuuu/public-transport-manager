package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_cities")
@Setter
@Getter
@ToString
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer city_id;
    private String name;
    private Integer nr_of_residents;
    private String postcode;

    public City() {}
}
