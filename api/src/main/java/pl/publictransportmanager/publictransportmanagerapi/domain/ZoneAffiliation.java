package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_zone_affiliations")
@Setter
@Getter
@ToString
public class ZoneAffiliation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer affiliation_id;

    @ManyToOne
    @JoinColumn(
            name = "city_id",
            referencedColumnName = "city_id"
    )
    private City city;

    @ManyToOne
    @JoinColumn(
            name = "zone_id",
            referencedColumnName = "zone_id"
    )
    private Zone zone;

    public ZoneAffiliation() {}
}
