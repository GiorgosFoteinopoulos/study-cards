package com.practice.studycards.deck;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequestMapping("/api/decks")
public class DeckController {

    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping 
    public List<DeckView> list() {
        return deckService.findAll();
    }

    @GetMapping("/{id}")
    public DeckView get(@PathVariable long id) {
        return deckService.findById(id);
    }

    @PostMapping 
    public ResponseEntity<DeckView> create(@RequestBody CreateDeckRequest request) {
        DeckView created = deckService.create(request);
        URI location = URI.create("/api/decks/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
public DeckView rename(@PathVariable long id, @RequestBody CreateDeckRequest request) {
    return deckService.rename(id, request);
    }

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable long id) {
    deckService.delete(id);
    return ResponseEntity.noContent().build();
    }

}
