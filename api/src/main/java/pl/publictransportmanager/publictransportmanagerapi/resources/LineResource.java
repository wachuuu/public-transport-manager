package pl.publictransportmanager.publictransportmanagerapi.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.publictransportmanager.publictransportmanagerapi.domain.Line;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmBadRequestException;
import pl.publictransportmanager.publictransportmanagerapi.exceptions.PtmResourceNotFoundException;
import pl.publictransportmanager.publictransportmanagerapi.repositories.LineRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lines")
public class LineResource {

    @Autowired
    LineRepository lineRepository;

    @GetMapping("")
    public ResponseEntity<List<Line>> getAllLines(){
        List<Line> lines = lineRepository.findAll();
        return new ResponseEntity<>(lines, HttpStatus.OK);
    }

    @GetMapping("/{lineId}")
    public ResponseEntity<Line> getLineById(@PathVariable("lineId") Integer lineId){
        Optional<Line> line = lineRepository.findById(lineId);
        if (line.isPresent())
            return new ResponseEntity<>(line.get(), HttpStatus.OK);
        throw new PtmResourceNotFoundException("Line not found");
    }

    @PostMapping("")
    public ResponseEntity<Line> addLine(@RequestBody Line line){
        try{
            line.setLineId(null);
            return new ResponseEntity<>(lineRepository.save(line), HttpStatus.CREATED);
        } catch (Exception e){
            throw new PtmBadRequestException("Invalid request");
        }
    }

    @PutMapping("/{lineId}")
    public ResponseEntity<Line> updateLine(@PathVariable("lineId") Integer lineId,
                                           @RequestBody Line line){
        if (lineRepository.existsById(lineId)) {
            line.setLineId(lineId);
            try {
                return new ResponseEntity<>(lineRepository.save(line), HttpStatus.OK);
            } catch (Exception e) {
                throw new PtmBadRequestException("Invalid request");
            }
        } else
            throw new PtmResourceNotFoundException("Line not found");
    }

    @DeleteMapping("/{lineId}")
    public ResponseEntity<Line> deleteLine(@PathVariable("lineId") Integer lineId) {
        Optional<Line> line = lineRepository.findById(lineId);
        if (line.isPresent()) {
            lineRepository.delete(line.get());
            return new ResponseEntity<>(line.get(), HttpStatus.OK);
        } else
            throw new PtmResourceNotFoundException("Line not found");
    }
}
