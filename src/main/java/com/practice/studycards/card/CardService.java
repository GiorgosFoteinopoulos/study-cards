package com.practice.studycards.card;

import com.practice.studycards.deck.Deck;
import com.practice.studycards.deck.DeckRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service 
public class CardService {

    private static final int MAX_QUESTION_LENGTH = 500;
    private static final int MAX_ANSWER_LENGTH = 2000;

    private final CardRepository cards;
    private final DeckRepository decks;

    public CardService(CardRepository cards, DeckRepository decks) {
        this.cards = cards;
        this.decks = decks;
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

    @Transactional 
    public CardView create(long deckId, CreateCardRequest request) {
        Deck deck = decks.findById(deckId)
                    .orElseThrow(() -> deckNotFound(deckId));

        String question = clean(request.question(), "Question", MAX_QUESTION_LENGTH);
        String answer = clean(request.answer(), "Answer", MAX_ANSWER_LENGTH);

        Card saved = cards.save(new Card(deck, question, answer));
        return CardView.from(saved);
    }

    @Transactional(readOnly = true)
    public CardView findOne(long deckId, long cardId) {
        return cards.findByIdAndDeckId(cardId, deckId)
                .map(CardView::from)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Card " + cardId + " not found in deck " + deckId 
                ));
    }

     private static String clean(String value, String field, int maxLength) {
        String text = value == null ? "" : value.strip();

        if (text.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, field + " must not be empty");
        }
        if (text.length() > maxLength) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, field + " must be at most " + maxLength + " characters");
        }
        return text;
    }


    private static ResponseStatusException deckNotFound(long deckId) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Deck " + deckId + " not found");
    }

}
