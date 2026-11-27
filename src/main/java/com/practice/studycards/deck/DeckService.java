package com.practice.studycards.deck;

import com.practice.studycards.card.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DeckService {

    private final DeckRepository decks;
    private final CardRepository cards;

    public DeckService(DeckRepository decks, CardRepository cards) {
        this.decks = decks;
        this.cards = cards;
    }

    @Transactional(readOnly = true)
    public List<DeckView> findAll() {
        return decks.findAllByOrderByNameAsc()
                .stream()
                .map(DeckView::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DeckView findById(long id) {
        return DeckView.from(findDeck(id));
    }

    @Transactional
    public DeckView create(CreateDeckRequest request) {
        String name = request.name().strip();

        if (decks.existsByNameIgnoreCase(name)) {
            throw duplicateName(name);
        }

        Deck saved = decks.save(new Deck(name));
        return DeckView.from(saved);
    }

    @Transactional
    public DeckView rename(long id, CreateDeckRequest request) {
        Deck deck = findDeck(id);
        String name = request.name().strip();

        if (decks.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw duplicateName(name);
        }

        deck.rename(name);
        return DeckView.from(deck);
    }

    @Transactional
    public void delete(long id) {
        Deck deck = findDeck(id);
        cards.deleteByDeckId(id);
        decks.delete(deck);
    }

    private Deck findDeck(long id) {
        return decks.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Deck " + id + " not found"));
    }

    private static ResponseStatusException duplicateName(String name) {
        return new ResponseStatusException(
                HttpStatus.CONFLICT, "A deck named \"" + name + "\" already exists");
    }
}