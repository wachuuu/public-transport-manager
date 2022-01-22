package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_stops")
@Setter
@Getter
@ToString
public class Stop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( name = "stop_id" )
    private Integer stopId;
    private String name;
    private Boolean interactive_boards;

    @ManyToOne
    @JoinColumn(
            name = "zone_id",
            referencedColumnName = "zone_id"
    )
    private Zone zone;

    public Stop() {}
}
