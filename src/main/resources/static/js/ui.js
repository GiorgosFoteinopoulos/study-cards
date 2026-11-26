const deckList = document.querySelector("#deck-list");
const noDecks = document.querySelector("#no-decks");

const cardPanel = document.querySelector("#card-panel");
const selectedDeckName = document.querySelector("#selected-deck-name");
const cardList = document.querySelector("#card-list");
const noCards = document.querySelector("#no-cards");

const messages = {
    deck: document.querySelector("#deck-message"),
    card: document.querySelector("#card-message"),
};



export function renderDecks(decks, selectedDeckId) {
    deckList.replaceChildren();

    for (const deck of decks) {
        const item = document.createElement("li");
        item.className = "deck";
        item.classList.toggle("selected", deck.id === selectedDeckId);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "deck-button";
        button.dataset.deckId = deck.id;

        const name = document.createElement("span");
        name.className = "deck-name";
        name.textContent = deck.name;

        const date = document.createElement("span");
        date.className = "deck-date";
        date.textContent = "Created " + new Date(deck.createdAt).toLocaleDateString();

        button.append(name, date);
        item.append(button);
        deckList.append(item);
    }

    noDecks.hidden = decks.length > 0;
}



export function showCardPanel(deck) {
    selectedDeckName.textContent = deck.name;
    cardList.replaceChildren();
    noCards.hidden = true;
    cardPanel.hidden = false;
}

export function renderCards(cards) {
    cardList.replaceChildren();

    for (const card of cards) {
        const item = document.createElement("li");
        item.className = "card";

        const question = document.createElement("p");
        question.className = "card-question";
        question.textContent = card.question;

        const answer = document.createElement("p");
        answer.className = "card-answer";
        answer.textContent = card.answer;

        item.append(question, answer);
        cardList.append(item);
    }

    noCards.hidden = cards.length > 0;
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