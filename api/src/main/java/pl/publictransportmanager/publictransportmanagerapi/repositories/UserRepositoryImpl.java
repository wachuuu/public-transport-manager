package pl.publictransportmanager.publictransportmanagerapi.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import pl.publictransportmanager.publictransportmanagerapi.domain.User;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmAuthException;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
public class UserRepositoryImpl implements UserRepository{

    private static final String SQL_CREATE =
            "INSERT INTO PTM_USERS(USER_ID, EMAIL, PASSWORD) " +
            "VALUES(NEXTVAL('PTM_USERS_SEQ'), ?, ?)";

    private static final String SQL_COUNT_BY_EMAIL =
            "SELECT COUNT(*) FROM PTM_USERS WHERE EMAIL = ?";

    private static final String SQL_FIND_BY_ID =
            "SELECT USER_ID, EMAIL, PASSWORD " +
            "FROM PTM_USERS " +
            "WHERE USER_ID = ?";



    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public Integer create(String email, String password) throws PtmAuthException {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, email);
                ps.setString(2, password);
                return ps;
            }, keyHolder);
            return (Integer) keyHolder.getKeys().get("USER_ID");
        } catch (Exception e) {
            throw new PtmAuthException("Invalid parameters. Failed to create account");
        }
    }

    @Override
    public User findByEmailAndPassword(String email, String password) throws PtmAuthException {
        return null;
    }

    @Override
    public Integer getCountByEmail(String email) {
        return jdbcTemplate.queryForObject(SQL_COUNT_BY_EMAIL, new Object[]{email}, Integer.class);
    }

    @Override
    public User findById(Integer userId) {
        return jdbcTemplate.queryForObject(SQL_FIND_BY_ID, new Object[]{userId}, userRowMapper);
    }

    private RowMapper<User> userRowMapper = ((rs, rowNum) ->
            new User(rs.getInt("USER_ID"),
                rs.getString("EMAIL"),
                rs.getString("PASSWORD")));
}