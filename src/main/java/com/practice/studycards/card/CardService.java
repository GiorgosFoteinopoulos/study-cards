package com.practice.studycards.card;

import com.practice.studycards.deck.Deck;
import com.practice.studycards.deck.DeckRepository;
import com.practice.studycards.review.ReviewRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CardService {

    private final CardRepository cards;
    private final DeckRepository decks;
    private final ReviewRepository reviews;

    public CardService(CardRepository cards, DeckRepository decks, ReviewRepository reviews) {
        this.cards = cards;
        this.decks = decks;
        this.reviews = reviews;
    }

    @Transactional(readOnly = true)
    public List<CardView> findByDeck(long deckId) {
        if (!decks.existsById(deckId)) {
            throw deckNotFound(deckId);
        }
        return cards.findByDeckIdOrderByIdAsc(deckId)
                .stream()
                .map(CardView::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CardView findOne(long deckId, long cardId) {
        return CardView.from(findCard(deckId, cardId));
    }

    @Transactional
    public CardView create(long deckId, CreateCardRequest request) {
        Deck deck = decks.findById(deckId)
                .orElseThrow(() -> deckNotFound(deckId));

        String question = request.question().strip();
        String answer = request.answer().strip();

        Card saved = cards.save(new Card(deck, question, answer));
        return CardView.from(saved);
    }

    @Transactional
    public CardView update(long deckId, long cardId, CreateCardRequest request) {
        Card card = findCard(deckId, cardId);

        String question = request.question().strip();
        String answer = request.answer().strip();

        card.edit(question, answer);
        return CardView.from(card);
    }

    @Transactional
    public void delete(long deckId, long cardId) {
        Card card = findCard(deckId, cardId);
        reviews.deleteByCardId(cardId);
        cards.delete(card);
    }

    private Card findCard(long deckId, long cardId) {
        return cards.findByIdAndDeckId(cardId, deckId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Card " + cardId + " not found in deck " + deckId));
    }

    private static ResponseStatusException deckNotFound(long deckId) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Deck " + deckId + " not found");
    }
}