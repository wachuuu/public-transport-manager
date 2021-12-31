package pl.publictransportmanager.publictransportmanagerapi.resources;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.publictransportmanager.publictransportmanagerapi.Constants;
import pl.publictransportmanager.publictransportmanagerapi.domain.User;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmAuthException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.UserRepository;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/users")
public class UserResource {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        String email = user.getEmail();
        String password = user.getPassword();

        if (email != null)
            email = email.toLowerCase();
        User user_db = userRepository.findByEmail(email);
        if (user_db == null)
            throw new PtmAuthException("Invalid email or password");
        if(!BCrypt.checkpw(password, user_db.getPassword()))
            throw new PtmAuthException("Invalid email or password");
        return new ResponseEntity<>(generateJWTToken(user_db), HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        String email = user.getEmail();
        String password = user.getPassword();

        Pattern pattern = Pattern.compile("^(.+)@(.+)$");
        if(email != null)
            email = email.toLowerCase();
        else
            throw new PtmAuthException("No email provided");

        if(!pattern.matcher(email).matches())
            throw new PtmAuthException("Invalid email format");

        if (userRepository.existsByEmail(email))
            throw new PtmAuthException("Email already in use");

        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(10));
        user.setEmail(email);
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return new ResponseEntity<>(generateJWTToken(user), HttpStatus.OK);
    }

    private Map<String, String> generateJWTToken(User user) {
        long timestamp = System.currentTimeMillis();
        String token = Jwts.builder().signWith(SignatureAlgorithm.HS256, Constants.API_SECRET_KEY)
                .setIssuedAt(new Date(timestamp))
                .setExpiration(new Date(timestamp + Constants.TOKEN_VALIDITY))
                .claim("userId", user.getUser_id())
                .claim("email", user.getEmail())
                .compact();
        Map<String, String> map = new HashMap<>();
        map.put("token", token);
        return map;
    }
}
