package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_courses")
@Setter
@Getter
@ToString
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer course_id;

    @ManyToOne
    @JoinColumn(
            name = "LineId",
            referencedColumnName = "line_id"
    )
    private Line line;

    @ManyToOne
    @JoinColumn(
            name = "shuttle_type_id",
            referencedColumnName = "shuttle_type_id"
    )
    private ShuttleType shuttle_type;

    @ManyToOne
    @JoinColumn(
            name = "bus_id",
            referencedColumnName = "bus_id"
    )
    private Bus bus;

    @ManyToOne
    @JoinColumn(
            name = "driver_id",
            referencedColumnName = "driver_id"
    )
    private Driver driver;

    @Column( name = "departure_time")
    private String departureTime;
    private String arrival_time;

    public Course() {}
}
