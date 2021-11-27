package pl.publictransportmanager.publictransportmanagerapi.repositories;

import pl.publictransportmanager.publictransportmanagerapi.domain.User;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmAuthException;

public interface UserRepository {

    Integer create(String email, String password) throws PtmAuthException;

    User findByEmailAndPassword(String email, String password) throws PtmAuthException;

    Integer getCountByEmail(String email);

    User findById(Integer userId);

}
