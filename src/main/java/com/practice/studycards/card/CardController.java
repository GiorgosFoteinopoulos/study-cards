package com.practice.studycards.card;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping
    public ResponseEntity<CardView> create(@PathVariable long deckId,
                                            @RequestBody CreateCardRequest request) {

        CardView created = cardService.create(deckId, request);
        URI location = URI.create("/api/decks/" + deckId + "/cards/" + created.id());
        return ResponseEntity.created(location).body(created);
    }
}
