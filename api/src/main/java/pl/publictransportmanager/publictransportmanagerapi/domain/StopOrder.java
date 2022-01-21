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
            name = "LineId",
            referencedColumnName = "line_id"
    )
    private Line line;

    @ManyToOne
    @JoinColumn(
            name = "stopId",
            referencedColumnName = "stop_id"
    )
    private Stop stop;

    @Column( name = "position_in_order")
    private Integer positionInOrder;

    public StopOrder() {}

    public StopOrder(Line line, Stop stop, Integer pos) {
        this.id = null;
        this.line = line;
        this.stop = stop;
        this.positionInOrder = pos;
    }
}
