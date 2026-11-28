package com.practice.studycards.starter;

import java.util.List;

public record StarterData(List<StarterDeck> decks) {

    public record StarterDeck(String name, List<StarterCard> cards) {

    }

    public record StarterCard(String question, String answer) {
    }
}
