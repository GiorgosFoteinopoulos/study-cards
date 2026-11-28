package com.practice.studycards.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    void deleteByCardId(Long cardId);

    void deleteByCardDeckId(Long deckId);

    List<Review> findByCardIdOrderByReviewedAtDesc(Long cardId);

}
