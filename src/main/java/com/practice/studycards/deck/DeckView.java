package com.practice.studycards.deck;

import java.time.Instant;

public record DeckView(Long id, String name, Instant createdAt, long cardCount, long dueCount, long masteredCount) {

    public static DeckView from(Deck deck, DeckStats stats) {
        return new DeckView(deck.getId(), deck.getName(), deck.getCreatedAt(), stats.cardCount(), stats.dueCount(),
                stats.masteredCount());
    }
}
