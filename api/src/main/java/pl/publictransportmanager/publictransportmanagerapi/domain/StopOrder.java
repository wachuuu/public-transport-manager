package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_stops_order")
@Setter
@Getter
@ToString
public class StopOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(
            name = "lineNumber",
            referencedColumnName = "line_number"
    )
    private Line line;

    @ManyToOne
    @JoinColumn(
            name = "stop_id",
            referencedColumnName = "stop_id"
    )
    private Stop stop;

    @Column( name = "position_in_order")
    private Integer positionInOrder;

    public StopOrder() {}
}
