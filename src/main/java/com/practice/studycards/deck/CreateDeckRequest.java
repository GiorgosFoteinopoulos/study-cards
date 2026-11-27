package com.practice.studycards.deck;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateDeckRequest(
        @NotBlank(message = "Deck name must not be empty") @Size(max = 100, message = "Deck name must be at most 100 characters") String name) {

}
