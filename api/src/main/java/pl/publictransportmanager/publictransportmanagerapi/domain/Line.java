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
    private Integer line_number;
    private Boolean day_line;

    public Line() {}
}
