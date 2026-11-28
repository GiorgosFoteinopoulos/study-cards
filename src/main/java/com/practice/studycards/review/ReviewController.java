package com.practice.studycards.review;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decks/{deckId}/cards/{cardId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewView> rate(@PathVariable long deckId,
            @PathVariable long cardId,
            @Valid @RequestBody RateCardRequest request) {
        ReviewView created = reviewService.rate(deckId, cardId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<ReviewView> list(@PathVariable long deckId, @PathVariable long cardId) {
        return reviewService.findByCard(deckId, cardId);
    }

}
