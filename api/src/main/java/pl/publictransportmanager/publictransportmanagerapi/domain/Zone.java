package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_zones")
@Setter
@Getter
@ToString
public class Zone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer zone_id;
    private String symbol;

    public Zone() {}
}
