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


const messages = {
    deck: document.querySelector("#deck-message"),
    card: document.querySelector("#card-message"),
};

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

        const actions = document.createElement("div");
        actions.className = "card-actions";
        const edit = actionButton("Edit", "edit", "");
        const remove = actionButton("Delete", "delete", "danger");
        edit.dataset.cardId = card.id;
        remove.dataset.cardId = card.id;
        actions.append(edit, remove);

        item.append(question, answer, actions);
        cardList.append(item);
    }

    noCards.hidden = cards.length > 0;
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