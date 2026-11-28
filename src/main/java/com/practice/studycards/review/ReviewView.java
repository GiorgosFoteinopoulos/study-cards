package com.practice.studycards.review;

import java.time.Instant;

public record ReviewView(long id, long cardId, Rating rating, Instant reviewedAt) {

    public static ReviewView from(Review review) {
        return new ReviewView(
                review.getId(),
                review.getCard().getId(),
                review.getRating(),
                review.getReviewedAt());
    }

}
