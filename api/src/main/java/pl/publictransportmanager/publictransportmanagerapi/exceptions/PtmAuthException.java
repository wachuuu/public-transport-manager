package pl.publictransportmanager.publictransportmanagerapi.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class PtmAuthException extends RuntimeException {

    public PtmAuthException(String message) {
        super(message);
    }
}
