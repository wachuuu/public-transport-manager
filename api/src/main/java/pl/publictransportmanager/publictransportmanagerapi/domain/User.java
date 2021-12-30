package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {
    private Integer userId;
    private String email;
    private String password;
}
