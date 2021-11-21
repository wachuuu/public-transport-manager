package pl.publictransportmanager.publictransportmanagerapi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.publictransportmanager.publictransportmanagerapi.domain.User;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmAuthException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.UserRepository;

import java.util.regex.Pattern;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public User validateUser(String email, String password) throws PtmAuthException {
        return null;
    }

    @Override
    public User registerUser(String email, String password) throws PtmAuthException {
        Pattern pattern = Pattern.compile("^(.+)@(.+)$");
        if(email != null) email = email.toLowerCase();
        if(!pattern.matcher(email).matches())
            throw new PtmAuthException("Invalid email format");

        Integer count = userRepository.getCountByEmail(email);
        if(count > 0)
            throw new PtmAuthException("Email already in use");

        Integer userId = userRepository.create(email, password);
        return userRepository.findById(userId);
    }
}
