package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_tickets")
@Setter
@Getter
@ToString
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ticket_id;
    private String name;
    private Integer validity_days;

    @ManyToOne
    @JoinColumn(
            name = "zone_id",
            referencedColumnName = "zone_id"
    )
    private Zone zone;

    private Float price;
    private Boolean concessionary;


    public Ticket() {}
}
