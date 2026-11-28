package com.practice.studycards.deck;

public record DeckStats(Long deckId, Long cardCount, Long dueCount, Long masteredCount) {

    public static DeckStats empty(Long deckId) {
        return new DeckStats(deckId, 0L, 0L, 0L);
    }

}
