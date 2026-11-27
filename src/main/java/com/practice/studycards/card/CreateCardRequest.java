package com.practice.studycards.card;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCardRequest(
        @NotBlank(message = "Question must not be empty") @Size(max = 500, message = "Question must be at most 500 characters") String question,

        @NotBlank(message = "Answer must not be empty") @Size(max = 2000, message = "Answer must be at most 2000 characters") String answer) {
}
