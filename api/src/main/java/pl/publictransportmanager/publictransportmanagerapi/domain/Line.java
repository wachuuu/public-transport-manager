package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_lines")
@Setter
@Getter
@ToString
public class Line {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( name = "line_id")
    private Integer lineId;
    private Integer line_number;
    private Boolean day_line;

    public Line() {}

    public Line(Integer id) {
        this.lineId = id;
    }
}
