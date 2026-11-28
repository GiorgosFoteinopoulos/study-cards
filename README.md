# Study Cards

A flashcard app with **spaced repetition**: create decks of question and answer cards, study them with a flip card, rate how well you knew each answer, and the app decides when each card should come back.

Built with **Spring Boot 4** and **plain JavaScript**, as a practice project in four Scrum sprints planned and tracked in **Jira**.

## Features

- **Decks and cards:** create, rename, edit and delete, with clear validation messages under each field.
- **Starter decks:** a new database starts with 3 ready-made decks (Spring and JPA, JavaScript, Git and Scrum) and 30 cards.
- **Study mode:** one card at a time with a 3D flip, keyboard control, and a random order.
- **Ratings:** Again, Hard, Good or Easy after seeing the answer. Every rating is stored as a review.
- **Spaced repetition:** each rating sets the card's next due date. Studying shows only the cards that are due.
- **Progress:** every deck shows its card count, due count, mastered count and a progress bar. Each session ends with a summary of the ratings.

## Tech stack

| Layer | Technology |
|---|---|
| Language | Java 25 |
| Framework | Spring Boot 4.2 (Spring Web MVC, Spring Data JPA, Bean Validation) |
| Persistence | Hibernate 7, H2 database in file mode |
| JSON | Jackson 3 |
| Front end | HTML, CSS and JavaScript ES modules, no framework |
| Tests | JUnit Jupiter (JUnit 6) |
| Build | Maven (wrapper included) |

## Running it

Requirements: **JDK 25**. Maven comes with the project through the wrapper.

```
mvnw.cmd spring-boot:run
```

(On macOS or Linux: `./mvnw spring-boot:run`.)

Then open **http://localhost:8080**.

The database is saved in the `data/` folder, so your decks survive a restart. The folder is ignored by git. Delete it to start again from the starter decks.

### H2 console

Open **http://localhost:8080/h2-console** while the app is running:

| Field | Value |
|---|---|
| JDBC URL | `jdbc:h2:file:./data/studycards` |
| User Name | `sa` |
| Password | (empty) |

### Running the tests

```
mvnw.cmd test
```

## How studying works

### Keyboard

| Key | Action |
|---|---|
| Space or Enter | flip the card |
| 1, 2, 3, 4 | rate: Again, Hard, Good, Easy (after the answer is shown) |
| Left and Right arrows | previous and next card |
| Escape | end the session, or cancel an edit |

### The scheduling rule

Each card keeps a gap in days (`intervalDays`) and a due date (`dueAt`). A new card is due straight away. After a rating:

| Rating | New gap |
|---|---|
| Again | 0 days: due again right away |
| Hard | the same gap, at least 1 day |
| Good | 1 day the first time, then double |
| Easy | 4 days the first time, then triple |

The gap never goes above 365 days. A card answered Good every time comes back after 1, 2, 4, 8 and 16 days. A card counts as **mastered** once its gap reaches 7 days.

The rule lives in a plain Java class, `Scheduler`, with no Spring or database code, and it is covered by unit tests.

## REST API

All endpoints use JSON.

### Decks

| Method | Path | Result |
|---|---|---|
| GET | `/api/decks` | all decks with their counts, sorted by name |
| GET | `/api/decks/{id}` | one deck |
| POST | `/api/decks` | create a deck: `{"name": "..."}`, returns 201 |
| PUT | `/api/decks/{id}` | rename a deck |
| DELETE | `/api/decks/{id}` | delete a deck with its cards and reviews, returns 204 |

### Cards

| Method | Path | Result |
|---|---|---|
| GET | `/api/decks/{deckId}/cards` | the cards of a deck |
| GET | `/api/decks/{deckId}/cards/due` | the cards due now, most overdue first |
| GET | `/api/decks/{deckId}/cards/{cardId}` | one card |
| POST | `/api/decks/{deckId}/cards` | add a card: `{"question": "...", "answer": "..."}`, returns 201 |
| PUT | `/api/decks/{deckId}/cards/{cardId}` | edit a card |
| DELETE | `/api/decks/{deckId}/cards/{cardId}` | delete a card with its reviews, returns 204 |

### Reviews

| Method | Path | Result |
|---|---|---|
| GET | `/api/decks/{deckId}/cards/{cardId}/reviews` | the card's reviews, newest first |
| POST | `/api/decks/{deckId}/cards/{cardId}/reviews` | rate a card: `{"rating": "GOOD"}`, returns 201 and reschedules the card |

### Errors

Invalid input returns **400** with a message per field:

```json
{
  "status": 400,
  "message": "Please fix the marked fields",
  "fieldErrors": {
    "question": "Question must not be empty"
  }
}
```

A missing deck or card returns **404**, and a duplicate deck name returns **409**.

## Project structure

```
src/main/java/com/practice/studycards/
├── deck/       Deck entity, statistics query, service, controller
├── card/       Card entity, due-card query, service, controller
├── review/     Review entity, Rating enum, Scheduler, service, controller
├── error/      central handler for validation errors
└── starter/    loads the starter decks into an empty database

src/main/resources/
├── application.properties
├── starter-decks.json
└── static/     index.html, css/, js/ (api, ui, study, main)

src/test/java/com/practice/studycards/review/
└── SchedulerTest.java
```

### Design notes

- **Thin layers:** controllers handle HTTP, services hold the rules, repositories talk to the database.
- **DTOs:** request and response records (`CreateCardRequest`, `CardView`, ...) keep the entities inside the server.
- **Shape rules and business rules:** Bean Validation annotations check the input. Services check what needs the database, such as duplicate names.
- **Transactions:** deleting a deck removes its reviews, cards and the deck in one transaction.
- **No N+1 queries:** the deck list loads every deck's counts with one grouped JPQL query.

## Configuration

| Property | Default | Meaning |
|---|---|---|
| `studycards.starter-decks.enabled` | `true` | load the starter decks into an empty database |

## How it was built

The project was planned and tracked in Jira as a Scrum project:

- **Epics:** Decks and cards, Study mode.
- **Stories** with user stories and Given / When / Then acceptance criteria, estimated in story points.
- **Sprints** with a goal, a review and a retrospective each, and the velocity measured after every sprint.
- A **Definition of Done**, including a Maven build before every merge.
- **Bugs** fixed through their own branches and pull requests.
- **Release 1.0**, matched by the git tag `v1.0.0`.

Changes went through feature or bugfix branches and pull requests, with the Jira key in the branch name and the commit messages.