package pl.publictransportmanager.publictransportmanagerapi.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import pl.publictransportmanager.publictransportmanagerapi.domain.Driver;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class DriverRepositoryImpl implements DriverRepository{

    private static final String SQL_CREATE = "INSERT INTO ptm_drivers (pesel, name, surname, phone_number, email," +
            " address, salary) values (?, ?, ?, ?, ?, ?, ?)";

    private static final String SQL_FIND_BY_ID = "SELECT * FROM PTM_DRIVERS WHERE DRIVER_ID = ?";

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Driver> findAll() throws PtmResourceNotFoundException {
        return null;
    }

    @Override
    public Driver findById(Integer driverId) throws PtmResourceNotFoundException {
        try{
            return jdbcTemplate.queryForObject(SQL_FIND_BY_ID, new Object[]{driverId},driverRowMapper);
        }catch (Exception e){
            throw new PtmResourceNotFoundException("Driver not found");
        }
    }

    @Override
    public Integer create(String pesel, String name, String surname, String phone_number, String email,
                          String address, Double salary) throws PtmBadRequestException {
        try{
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1,pesel);
                ps.setString(2,name);
                ps.setString(3,surname);
                ps.setString(4,phone_number);
                ps.setString(5,email);
                ps.setString(6,address);
                ps.setDouble(7,salary);
                return ps;
            }, keyHolder);
            return (Integer) keyHolder.getKeys().get("DRIVER_ID");
        }catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @Override
    public void update(Integer driverId, Driver driver) throws PtmBadRequestException {

    }

    @Override
    public void removeById(Integer driverId) {

    }

    private RowMapper<Driver> driverRowMapper = ((rs, rowNum) -> {
       return new Driver(rs.getInt("DRIVER_ID"),
               rs.getString("PESEL"),
               rs.getString("NAME"),
               rs.getString("SURNAME"),
               rs.getString("PHONE_NUMBER"),
               rs.getString("EMAIL"),
               rs.getString("ADDRESS"),
               rs.getDouble("SALARY"));
    });
}
