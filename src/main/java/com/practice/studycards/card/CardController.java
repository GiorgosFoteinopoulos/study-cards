package com.practice.studycards.card;

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

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decks/{deckId}/cards")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public List<CardView> list(@PathVariable long deckId) {
        return cardService.findByDeck(deckId);
    }

    @GetMapping("/{cardId}")
    public CardView get(@PathVariable long deckId, @PathVariable long cardId) {
        return cardService.findOne(deckId, cardId);
    }

    @PostMapping
    public ResponseEntity<CardView> create(@PathVariable long deckId,
            @Valid @RequestBody CreateCardRequest request) {

        CardView created = cardService.create(deckId, request);
        URI location = URI.create("/api/decks/" + deckId + "/cards/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{cardId}")
    public CardView update(@PathVariable long deckId, @PathVariable long cardId,
            @Valid @RequestBody CreateCardRequest request) {
        return cardService.update(deckId, cardId, request);
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> delete(@PathVariable long deckId, @PathVariable long cardId) {
        cardService.delete(deckId, cardId);
        return ResponseEntity.noContent().build();
    }
}
