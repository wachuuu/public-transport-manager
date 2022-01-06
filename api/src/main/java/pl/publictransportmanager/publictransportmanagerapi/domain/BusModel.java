package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_bus_models")
@Setter
@Getter
@ToString
public class BusModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer model_id;
    private String model_name;
    private Integer year_of_production;
    private Integer number_of_seats;

    @ManyToOne
    @JoinColumn(
            name = "brand_id",
            referencedColumnName = "brand_id"
    )
    private Brand brand;


    public BusModel() {}
}
