package pl.publictransportmanager.publictransportmanagerapi.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PtmResourceNotFoundException extends RuntimeException{

    public PtmResourceNotFoundException(String message){
        super(message);
    }
}
