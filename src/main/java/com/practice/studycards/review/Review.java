package com.practice.studycards.review;

import java.time.Instant;

import com.practice.studycards.card.Card;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GenerationType;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Rating rating;

    @Column(nullable = false)
    private Instant reviewedAt;

    protected Review() {

    }

    public Review(Card card, Rating rating) {
        this.card = card;
        this.rating = rating;
        this.reviewedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Card getCard() {
        return card;
    }

    public Rating getRating() {
        return rating;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }
}
