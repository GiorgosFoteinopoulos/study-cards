const deckPanel = document.querySelector("#deck-panel");
const deckList = document.querySelector("#deck-list");
const noDecks = document.querySelector("#no-decks");
const deckNameInput = document.querySelector("#deck-name");
const deckSubmit = document.querySelector("#deck-submit");
const deckCancel = document.querySelector("#deck-cancel");

const cardPanel = document.querySelector("#card-panel");
const selectedDeckName = document.querySelector("#selected-deck-name");
const cardList = document.querySelector("#card-list");
const noCards = document.querySelector("#no-cards");
const questionInput = document.querySelector("#card-question");
const answerInput = document.querySelector("#card-answer");
const cardSubmit = document.querySelector("#card-submit");
const cardCancel = document.querySelector("#card-cancel");
const studyStart = document.querySelector("#study-start");

const studyPanel = document.querySelector("#study-panel");
const studyDeckName = document.querySelector("#study-deck-name");
const studyArea = document.querySelector("#study-area");
const studyProgress = document.querySelector("#study-progress");
const studyCard = document.querySelector("#study-card");
const studyFront = document.querySelector("#study-front");
const studyBack = document.querySelector("#study-back");
const studyQuestion = document.querySelector("#study-question");
const studyAnswer = document.querySelector("#study-answer");
const studyPrev = document.querySelector("#study-prev");
const studyNext = document.querySelector("#study-next");
const studyDone = document.querySelector("#study-done");
const studyDoneText = document.querySelector("#study-done-text");
const studyAgain = document.querySelector("#study-again");
const ratingButtons = document.querySelector("#rating-buttons");

const messages = {
    deck: document.querySelector("#deck-message"),
    card: document.querySelector("#card-message"),
    study: document.querySelector("#study-message"),
};

const fields = {
    deck: {
        name: { input: deckNameInput, error: document.querySelector("#deck-name-error") },
    },
    card: {
        question: { input: questionInput, error: document.querySelector("#card-question-error") },
        answer: { input: answerInput, error: document.querySelector("#card-answer-error") },
    },
};


const DAY_MS = 24 * 60 * 60 * 1000;

function isDue(card, now) {
    return new Date(card.dueAt) <= now;
}

function dueText(card, now) {
    if (isDue(card, now)) {
        return "Due now";
    }
    const days = Math.ceil((new Date(card.dueAt) - now) / DAY_MS);
    return days === 1 ? "Due tomorrow" : `Due in ${days} days`;
}

function actionButton(label, action, extraClass) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary small " + extraClass;
    button.textContent = label;
    button.dataset.action = action;
    return button;
}


export function renderDecks(decks, selectedDeckId) {
    deckList.replaceChildren();

    for (const deck of decks) {
        const item = document.createElement("li");
        item.className = "deck";
        item.classList.toggle("selected", deck.id === selectedDeckId);

        const selectButton = document.createElement("button");
        selectButton.type = "button";
        selectButton.className = "deck-button";
        selectButton.dataset.deckId = deck.id;

        const name = document.createElement("span");
        name.className = "deck-name";
        name.textContent = deck.name;

        const date = document.createElement("span");
        date.className = "deck-date";
        date.textContent = "Created " + new Date(deck.createdAt).toLocaleDateString();

        selectButton.append(name, date);

        const actions = document.createElement("div");
        actions.className = "deck-actions";
        const rename = actionButton("Rename", "rename", "");
        const remove = actionButton("Delete", "delete", "danger");
        rename.dataset.deckId = deck.id;
        remove.dataset.deckId = deck.id;
        actions.append(rename, remove);

        item.append(selectButton, actions);
        deckList.append(item);
    }

    noDecks.hidden = decks.length > 0;
}

export function setDeckFormMode(deck) {
    if (deck === null) {
        deckNameInput.value = "";
        deckSubmit.textContent = "Create deck";
        deckCancel.hidden = true;
    } else {
        deckNameInput.value = deck.name;
        deckSubmit.textContent = "Rename deck";
        deckCancel.hidden = false;
    }
}


export function showCardPanel(deck) {
    setCardPanelTitle(deck.name);
    cardList.replaceChildren();
    noCards.hidden = true;
    studyStart.hidden = true;
    cardPanel.hidden = false;
}

export function setCardPanelTitle(name) {
    selectedDeckName.textContent = name;
}

export function hideCardPanel() {
    cardPanel.hidden = true;
}

export function renderCards(cards, editingCardId) {
    cardList.replaceChildren();
    const now = new Date();

    for (const card of cards) {
        const item = document.createElement("li");
        item.className = "card";
        item.classList.toggle("editing", card.id === editingCardId);

        const question = document.createElement("p");
        question.className = "card-question";
        question.textContent = card.question;

        const answer = document.createElement("p");
        answer.className = "card-answer";
        answer.textContent = card.answer;

        const due = document.createElement("p");
        due.className = "card-due";
        due.classList.toggle("is-due", isDue(card, now));
        due.textContent = dueText(card, now);

        const actions = document.createElement("div");
        actions.className = "card-actions";
        const edit = actionButton("Edit", "edit", "");
        const remove = actionButton("Delete", "delete", "danger");
        edit.dataset.cardId = card.id;
        remove.dataset.cardId = card.id;
        actions.append(edit, remove);

        item.append(question, answer, due, actions);
        cardList.append(item);
    }

    noCards.hidden = cards.length > 0;

    const dueCount = cards.filter((card) => isDue(card, now)).length;
    studyStart.hidden = cards.length === 0;
    studyStart.disabled = dueCount === 0;
    studyStart.textContent = dueCount === 0 ? "Nothing due" : `Study ${dueCount} due`;
}

export function setCardFormMode(card) {
    if (card === null) {
        questionInput.value = "";
        answerInput.value = "";
        cardSubmit.textContent = "Add card";
        cardCancel.hidden = true;
    } else {
        questionInput.value = card.question;
        answerInput.value = card.answer;
        cardSubmit.textContent = "Save changes";
        cardCancel.hidden = false;
    }
}


export function showMessage(area, text, isError) {
    const element = messages[area];
    element.textContent = text;
    element.classList.toggle("error", isError);
    element.hidden = false;
}

export function clearMessage(area) {
    const element = messages[area];
    element.textContent = "";
    element.hidden = true;
}


export function showFieldErrors(form, fieldErrors) {
    for (const [field, parts] of Object.entries(fields[form])) {
        const text = fieldErrors[field];
        parts.error.textContent = text ?? "";
        parts.error.hidden = !text;
        parts.input.classList.toggle("invalid", Boolean(text));
        parts.input.setAttribute("aria-invalid", text ? "true" : "false");
    }
}

export function clearFieldErrors(form) {
    showFieldErrors(form, {});
}

export function clearFieldError(form, field) {
    const parts = fields[form][field];
    if (!parts) {
        return;
    }
    parts.error.textContent = "";
    parts.error.hidden = true;
    parts.input.classList.remove("invalid");
    parts.input.setAttribute("aria-invalid", "false");
}


export function showStudyPanel(deckName) {
    studyDeckName.textContent = deckName;
    deckPanel.hidden = true;
    cardPanel.hidden = true;
    studyPanel.hidden = false;
}

export function hideStudyPanel() {
    studyPanel.hidden = true;
    deckPanel.hidden = false;
    cardPanel.hidden = false;
}

export function focusStudyCard() {
    studyCard.focus();
}

export function focusStudyStart() {
    studyStart.focus();
}

export function renderStudy(session, cardChanged) {
    studyArea.hidden = session.finished;
    studyDone.hidden = !session.finished;

    if (session.finished) {
        studyDoneText.textContent =
            `You went through all ${session.total} cards, looked at ${session.revealedCount} answers ` +
            `and rated ${session.ratedCount}.`;
        studyAgain.focus();
        return;
    }

    if (cardChanged) {

        studyCard.classList.add("instant");
        studyCard.classList.remove("flipped");
        void studyCard.offsetWidth;
        studyCard.classList.remove("instant");

        studyQuestion.textContent = session.card.question;
        studyAnswer.textContent = session.card.answer;
    }

    studyCard.classList.toggle("flipped", session.flipped);
    studyFront.setAttribute("aria-hidden", String(session.flipped));
    studyBack.setAttribute("aria-hidden", String(!session.flipped));

    studyProgress.textContent = `Card ${session.position} of ${session.total}`;
    studyPrev.disabled = session.isFirst;
    studyNext.textContent = session.isLast ? "Finish" : "Next";
    ratingButtons.hidden = !session.flipped;   // rate only after seeing the answer
}

export function setRatingBusy(busy) {
    for (const button of ratingButtons.querySelectorAll("button")) {
        button.disabled = busy;
    }
}