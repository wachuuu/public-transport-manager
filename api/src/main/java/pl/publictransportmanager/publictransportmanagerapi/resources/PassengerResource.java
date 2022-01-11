package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Passenger;
import pl.publictransportmanager.publictransportmanagerapi.domain.Ticket;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.PassengerRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.TicketRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/passengers")
public class PassengerResource {

    @Autowired
    PassengerRepository passengerRepository;

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    TicketResource ticketResource;

    @GetMapping("")
    public ResponseEntity<List<Passenger>> getAllPassengers(){
        List<Passenger> passengers = passengerRepository.findAll();
        return new ResponseEntity<>(passengers, HttpStatus.OK);
    }

    @GetMapping("/{passengerId}")
    public ResponseEntity<Passenger> getPassengerById(@PathVariable("passengerId") Integer passengerId){
        Optional<Passenger> passenger = passengerRepository.findById(passengerId);
        if (passenger.isPresent())
            return new ResponseEntity<>(passenger.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Passenger not found");
    }

    @PostMapping("")
    public ResponseEntity<Passenger> addPassenger(@RequestBody Passenger passenger){
        try{
            checkTicket(passenger);
            passenger.setPassenger_id(null);
            return new ResponseEntity<>(passengerRepository.save(passenger), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{passengerId}")
    public ResponseEntity<Passenger> updatePassenger(@PathVariable("passengerId") Integer passengerId,
                                                     @RequestBody Passenger passenger){
        if (passengerRepository.existsById(passengerId)) {
            try {
                checkTicket(passenger);
                passenger.setPassenger_id(passengerId);
                return new ResponseEntity<>(passengerRepository.save(passenger), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Passenger not found");
    }

    @DeleteMapping("/{passengerId}")
    public ResponseEntity<Passenger> deletePassenger(@PathVariable("passengerId") Integer passengerId) {
        Optional<Passenger> passenger = passengerRepository.findById(passengerId);
        if (passenger.isPresent()) {
            passengerRepository.delete(passenger.get());
            return new ResponseEntity<>(passenger.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Passenger not found");
    }

    public void checkTicket(Passenger passenger) {
        if (passenger.getTicket().getTicket_id() != null) {
            Optional<Ticket> ticketFound = ticketRepository.findById(passenger.getTicket().getTicket_id());
            if (ticketFound.isPresent())
                passenger.setTicket(ticketFound.get());
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                passenger.setTicket(ticketRepository.save(ticketResource.checkZone(passenger.getTicket())));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
    }
}
