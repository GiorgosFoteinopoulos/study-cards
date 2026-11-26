package com.practice.studycards.card;

import java.time.Instant;

public record CardView(long id, long deckId, String question, String answer, Instant createdAt) {

    public static CardView from(Card card) {
        return new CardView(
                 card.getId(),
                 card.getDeck().getId(),
                 card.getQuestion(),
                 card.getAnswer(),
                 card.getCreatedAt());
    }
}
