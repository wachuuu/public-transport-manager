package pl.publictransportmanager.publictransportmanagerapi.services;

import pl.publictransportmanager.publictransportmanagerapi.domain.User;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmAuthException;

public interface UserService {

    User validateUser(String email, String password) throws PtmAuthException;

    User registerUser(String email, String password) throws PtmAuthException;
}
