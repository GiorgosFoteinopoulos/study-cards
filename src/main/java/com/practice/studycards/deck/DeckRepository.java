package com.practice.studycards.deck;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeckRepository extends JpaRepository<Deck, Long> {

    List<Deck> findAllByOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    @Query("""
            select new com.practice.studycards.deck.DeckStats(
                 c.deck.id,
                 count(c),
                 sum(case when c.dueAt <= :now then 1 else 0 end),
                 sum(case when c.intervalDays >= :masteredDays then 1 else 0 end))
            from Card c
            group by c.deck.id""")
    List<DeckStats> findStats(@Param("now") Instant now, @Param("masteredDays") int masteredDays);

    @Query("""
            select new com.practice.studycards.deck.DeckStats(
                    c.deck.id,
                    count(c),
                    sum(case when c.dueAt <= :now then 1 else 0 end),
                    sum(case when c.intervalDays >= :masteredDays then 1 else 0 end))
                    from Card c
                    where c.deck.id = :deckId
                    group by c.deck.id
                    """)
    Optional<DeckStats> findStatsByDeckId(@Param("deckId") Long deckId,
            @Param("now") Instant now,
            @Param("masteredDays") int masteredDays);
}
