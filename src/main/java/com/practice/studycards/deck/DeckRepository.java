package com.practice.studycards.deck;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    
    List<Deck> findAllByOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);
}
