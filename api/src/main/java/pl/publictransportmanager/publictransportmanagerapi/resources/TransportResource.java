package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/transport")
public class TransportResource {

    @GetMapping("/check-auth")
    public String checkAuth(HttpServletRequest request) {
        int userId = (Integer) request.getAttribute("userId");
        return "Authenticated! UserId is: " + userId;
    }
}
