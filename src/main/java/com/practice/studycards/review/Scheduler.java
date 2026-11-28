package com.practice.studycards.review;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

public final class Scheduler {

    private static final int MAX_INTERVAL_DAYS = 365;

    private Scheduler() {

    }

    public static int nextInterval(int currentDays, Rating rating) {
        int next = switch (rating) {
            case AGAIN -> 0;
            case HARD -> Math.max(1, currentDays);
            case GOOD -> currentDays == 0 ? 1 : currentDays * 2;
            case EASY -> currentDays == 0 ? 4 : currentDays * 3;
        };
        return Math.min(next, MAX_INTERVAL_DAYS);
    }

    public static Instant dueAt(Instant now, int intervalDays) {
        return now.plus(intervalDays, ChronoUnit.DAYS);
    }
}
