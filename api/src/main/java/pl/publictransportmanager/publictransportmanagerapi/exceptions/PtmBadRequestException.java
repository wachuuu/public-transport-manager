package pl.publictransportmanager.publictransportmanagerapi.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PtmBadRequestException extends RuntimeException{

    public PtmBadRequestException(String message){
        super(message);
    }
}
