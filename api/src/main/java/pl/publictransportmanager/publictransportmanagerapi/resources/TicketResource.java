package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Zone;
import pl.publictransportmanager.publictransportmanagerapi.domain.Ticket;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.ZoneRepository;
import pl.publictransportmanager.publictransportmanagerapi.repositories.TicketRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
public class TicketResource {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    ZoneRepository zoneRepository;

    @GetMapping("")
    public ResponseEntity<List<Ticket>> getAllTickets(){
        List<Ticket> tickets = ticketRepository.findAll();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable("ticketId") Integer ticketId){
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        if (ticket.isPresent())
            return new ResponseEntity<>(ticket.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Ticket not found");
    }

    @PostMapping("")
    public ResponseEntity<Ticket> addTicket(@RequestBody Ticket ticket){
        try{
            ticket = checkZone(ticket);
            ticket.setTicket_id(null);
            return new ResponseEntity<>(ticketRepository.save(ticket), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{ticketId}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable("ticketId") Integer ticketId,
                                               @RequestBody Ticket ticket){
        if (ticketRepository.existsById(ticketId)){
            try {
                ticket = checkZone(ticket);
                ticket.setTicket_id(ticketId);
                return new ResponseEntity<>(ticketRepository.save(ticket), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Ticket not found");
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<Ticket> deleteTicket(@PathVariable("ticketId") Integer ticketId) {
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        if (ticket.isPresent()) {
            ticketRepository.delete(ticket.get());
            return new ResponseEntity<>(ticket.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Ticket not found");
    }

    public Ticket checkZone(Ticket ticket) {
        if (ticket.getZone().getZone_id() != null) {
            Optional<Zone> zoneFound = zoneRepository.findById(ticket.getZone().getZone_id());
            if (zoneFound.isPresent())
                ticket.setZone(zoneFound.get());
            else {
                throw new PtmBadRequestException("Invalid request");
            }
        } else {
            try {
                ticket.setZone(zoneRepository.save(ticket.getZone()));
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        }
        return ticket;
    }
}
