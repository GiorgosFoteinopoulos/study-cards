package com.practice.studycards.deck;

import java.time.Instant;

public record DeckView(Long id, String name, Instant createdAt) {

    public static DeckView from(Deck deck) {
        return new DeckView(deck.getId(), deck.getName(), deck.getCreatedAt());
    }
    
}
