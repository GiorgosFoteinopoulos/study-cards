package com.practice.studycards.card;

import com.practice.studycards.deck.Deck;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.Instant;

@Entity
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    @Column(nullable = false, length = 2000)
    private String question;

    @Column(nullable = false, length = 2000)
    private String answer;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private int intervalDays;

    @Column(nullable = false)
    private Instant dueAt;

    protected Card() {

    }

    public Card(Deck deck, String question, String answer) {
        this.deck = deck;
        this.question = question;
        this.answer = answer;
        this.createdAt = Instant.now();
        this.intervalDays = 0;
        this.dueAt = this.createdAt;
    }

    public Long getId() {
        return id;
    }

    public Deck getDeck() {
        return deck;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public int getIntervalDays() {
        return intervalDays;
    }

    public Instant getDueAt() {
        return dueAt;
    }

    public void edit(String newQuestion, String newAnswer) {
        this.question = newQuestion;
        this.answer = newAnswer;
    }

    public void reschedule(int newIntervalDays, Instant newDueAt) {
        this.intervalDays = newIntervalDays;
        this.dueAt = newDueAt;
    }
}