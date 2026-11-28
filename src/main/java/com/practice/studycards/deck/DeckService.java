package com.practice.studycards.deck;

import com.practice.studycards.card.CardRepository;
import com.practice.studycards.review.ReviewRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DeckService {

    private static final int MASTERED_INTERVAL_DAYS = 7;

    private final DeckRepository decks;
    private final CardRepository cards;
    private final ReviewRepository reviews;

    public DeckService(DeckRepository decks, CardRepository cards, ReviewRepository reviews) {
        this.decks = decks;
        this.cards = cards;
        this.reviews = reviews;
    }

    @Transactional(readOnly = true)
    public List<DeckView> findAll() {
        Map<Long, DeckStats> statsByDeck = decks.findStats(Instant.now(), MASTERED_INTERVAL_DAYS)
                .stream()
                .collect(Collectors.toMap(DeckStats::deckId, Function.identity()));

        return decks.findAllByOrderByNameAsc()
                .stream()
                .map(deck -> DeckView.from(deck,
                        statsByDeck.getOrDefault(deck.getId(), DeckStats.empty(deck.getId()))))
                .toList();
    }

    @Transactional(readOnly = true)
    public DeckView findById(long id) {
        return toView(findDeck(id));
    }

    @Transactional
    public DeckView create(CreateDeckRequest request) {
        String name = request.name().strip();

        if (decks.existsByNameIgnoreCase(name)) {
            throw duplicateName(name);
        }

        Deck saved = decks.save(new Deck(name));
        return toView(saved);
    }

    @Transactional
    public DeckView rename(long id, CreateDeckRequest request) {
        Deck deck = findDeck(id);
        String name = request.name().strip();

        if (decks.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw duplicateName(name);
        }

        deck.rename(name);
        return toView(deck);
    }

    @Transactional
    public void delete(long id) {
        Deck deck = findDeck(id);
        reviews.deleteByCardDeckId(id);
        cards.deleteByDeckId(id);
        decks.delete(deck);
    }

    private DeckView toView(Deck deck) {
        DeckStats stats = decks.findStatsByDeckId(deck.getId(), Instant.now(), MASTERED_INTERVAL_DAYS)
                .orElse(DeckStats.empty(deck.getId()));
        return DeckView.from(deck, stats);
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