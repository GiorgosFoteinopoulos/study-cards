package com.practice.studycards.review;

import jakarta.validation.constraints.NotNull;

public record RateCardRequest(

        @NotNull(message = "Rating is required") Rating rating) {

}
