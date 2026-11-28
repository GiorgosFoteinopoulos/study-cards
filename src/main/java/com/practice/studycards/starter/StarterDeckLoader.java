package com.practice.studycards.starter;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.core.io.Resource;

import com.practice.studycards.card.Card;
import com.practice.studycards.card.CardRepository;
import com.practice.studycards.deck.Deck;
import com.practice.studycards.deck.DeckRepository;

import jakarta.transaction.Transactional;
import tools.jackson.databind.json.JsonMapper;

@Component
public class StarterDeckLoader implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(StarterDeckLoader.class);

    private final DeckRepository decks;
    private final CardRepository cards;
    private final JsonMapper jsonMapper;
    private final Resource starterFile;
    private final boolean enabled;

    public StarterDeckLoader(DeckRepository decks,
            CardRepository cards,
            JsonMapper jsonMapper,
            @Value("classpath:starter-decks.json") Resource starterfile,
            @Value("${studycards.starter-decks.enabled:true}") boolean enabled) {
        this.decks = decks;
        this.cards = cards;
        this.jsonMapper = jsonMapper;
        this.starterFile = starterfile;
        this.enabled = enabled;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        if (!enabled) {
            log.info("Starter decks disabled");
            return;
        }
        if (decks.count() > 0) {
            log.info("Starter decks skipped: the database already has decks");
            return;
        }

        StarterData data = readStarterFile();
        int cardCount = 0;

        for (StarterData.StarterDeck starterDeck : data.decks()) {
            Deck deck = decks.save(new Deck(starterDeck.name()));
            for (StarterData.StarterCard starterCard : starterDeck.cards()) {
                cards.save(new Card(deck, starterCard.question(), starterCard.answer()));
                cardCount++;
            }
        }
        log.info("Starter decks loaded: {} decks, {} cards", data.decks().size(), cardCount);
    }

    private StarterData readStarterFile() {
        try (InputStream in = starterFile.getInputStream()) {
            return jsonMapper.readValue(in, StarterData.class);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not read starter-decks.json", e);
        }
    }
}
