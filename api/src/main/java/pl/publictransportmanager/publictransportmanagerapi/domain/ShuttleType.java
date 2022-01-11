package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ptm_shuttle_types")
@Setter
@Getter
@ToString
public class ShuttleType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer shuttle_type_id;
    private String type;

    public ShuttleType() {}
}
