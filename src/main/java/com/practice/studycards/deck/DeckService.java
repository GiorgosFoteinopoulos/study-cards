package com.practice.studycards.deck;


import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service 
public class DeckService {
    
    private static final int MAX_NAME_LENGTH = 100;

    private final DeckRepository decks;

    public DeckService(DeckRepository decks) {
        this.decks = decks;
    }

    @Transactional 
    public List<DeckView> findAll() {
        return decks.findAllByOrderByNameAsc()
        .stream()
        .map(DeckView::from)
            .toList();
    }

     @Transactional(readOnly = true)
    public DeckView findById(long id) {
        return decks.findById(id)
                .map(DeckView::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Deck " + id + " not found"));
    }

    @Transactional
    public DeckView create(CreateDeckRequest request) {
        String name = request.name() == null ? "" : request.name().strip();

        if (name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deck name must not be empty");
        }

        if (name.length() > MAX_NAME_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deck name must be at most " + MAX_NAME_LENGTH + " characters");
        }

        Deck saved = decks.save(new Deck(name));
        return DeckView.from(saved);
    }
}
