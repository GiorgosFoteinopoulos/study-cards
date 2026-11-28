package com.practice.studycards.review;

import com.practice.studycards.card.Card;
import com.practice.studycards.card.CardRepository;

import java.time.Instant;
import java.util.List;

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

    @Transactional(readOnly = true)
    public List<ReviewView> findByCard(long deckId, long cardId) {
        findCard(deckId, cardId);
        return reviews.findByCardIdOrderByReviewedAtDesc(cardId)
                .stream()
                .map(ReviewView::from)
                .toList();
    }

        @Transactional
    public ReviewView rate(long deckId, long cardId, RateCardRequest request) {
        Card card = findCard(deckId, cardId);
        Rating rating = request.rating();
        Review saved = reviews.save(new Review(card, rating));

        int interval = Scheduler.nextInterval(card.getIntervalDays(), rating);
        card.reschedule(interval, Scheduler.dueAt(Instant.now(), interval));   // dirty checking saves it

        return ReviewView.from(saved);
    }

    private Card findCard(long deckId, long cardId) {
        return cards.findByIdAndDeckId(cardId, deckId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Card " + cardId + " not found in deck " + deckId));
    }
}