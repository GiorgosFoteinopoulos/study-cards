package com.practice.studycards.card;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByDeckIdOrderByIdAsc(Long deckId);

    Optional<Card> findByIdAndDeckId(Long id, Long deckId);

    void deleteByDeckId(Long deckId);

    @Query("select c from Card c where c.deck.id = :deckId and c.dueAt <= :now order by c.dueAt")
    List<Card> findDue(@Param("deckId") Long deckId, @Param("now") Instant now);
}
