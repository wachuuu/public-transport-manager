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
    @Column( name = "line_number")
    private Integer lineNumber;
    private Boolean day_line;

    public Line() {}
}
