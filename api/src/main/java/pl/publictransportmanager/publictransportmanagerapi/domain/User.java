package pl.publictransportmanager.publictransportmanagerapi.domain;

import lombok.*;

@Data
@AllArgsConstructor
public class User {
    private Integer userId;
    private String email;
    private String password;
}
