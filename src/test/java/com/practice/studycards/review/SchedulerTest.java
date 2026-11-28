package com.practice.studycards.review;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SchedulerTest {

    @Test
    void againResetsTheInterval() {
        assertEquals(0, Scheduler.nextInterval(16, Rating.AGAIN));
    }

    @Test
    void firstGoodIsOneDay() {
        assertEquals(1, Scheduler.nextInterval(0, Rating.GOOD));
    }

    @Test
    void goodDoublesTheInterval() {
        assertEquals(16, Scheduler.nextInterval(8, Rating.GOOD));
    }

    @Test
    void hardKeepsTheIntervalButAtLeastOneDay() {
        assertEquals(1, Scheduler.nextInterval(0, Rating.HARD));
        assertEquals(8, Scheduler.nextInterval(8, Rating.HARD));
    }

    @Test
    void intervalNeverExceedsAYear() {
        assertEquals(365, Scheduler.nextInterval(300, Rating.EASY));
    }

    @Test
    void dueAtAddsWholeDays() {
        Instant now = Instant.parse("2026-12-01T10:00:00Z");
        assertEquals(Instant.parse("2026-12-05T10:00:00Z"), Scheduler.dueAt(now, 4));
    }
}