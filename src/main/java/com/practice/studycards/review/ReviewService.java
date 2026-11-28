package com.practice.studycards.review;

import com.practice.studycards.card.Card;
import com.practice.studycards.card.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReviewService {

    private final ReviewRepository reviews;
    private final CardRepository cards;

    public ReviewService(ReviewRepository reviews, CardRepository cards) {
        this.reviews = reviews;
        this.cards = cards;
    }

    @Transactional
    public ReviewView rate(long deckId, long cardId, RateCardRequest request) {
        Card card = cards.findByIdAndDeckId(cardId, deckId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Card " + cardId + " not found in deck " + deckId));

        Review saved = reviews.save(new Review(card, request.rating()));
        return ReviewView.from(saved);
    }
}