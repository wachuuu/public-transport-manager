package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "ptm_buses")
@Setter
@Getter
@ToString
public class Bus {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer bus_id;
    private String number_plate;
    private Date purchase_date;
    private Date service_date;
    private Double monthly_maintenance_cost;
    private Double cost;

    @ManyToOne
    @JoinColumn(
            name = "model_id",
            referencedColumnName = "model_id"
    )
    private BusModel bus_model;


    public Bus() {}
}
