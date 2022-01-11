package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "ptm_passengers")
@Setter
@Getter
@ToString
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer passenger_id;
    private String pesel;
    private String name;
    private String surname;
    private String phone_number;
    private String email;
    private String address;

    @ManyToOne
    @JoinColumn(
            name = "ticket_id",
            referencedColumnName = "ticket_id"
    )
    private Ticket ticket;

    private Date date_of_purchase;
    private Date valid_till;


    public Passenger() {}
}
