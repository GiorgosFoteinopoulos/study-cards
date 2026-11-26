const list = document.querySelector("#deck-list");
const empty = document.querySelector("#empty");
const messages = {
    deck: document.querySelector("#deck-message"),
    card: document.querySelector("#card-message"),
};

export function renderDecks(decks) {
    list.replaceChildren();

    for (const deck of decks) {
        const item = document.createElement("li");
        item.className = "deck";

        const name = document.createElement("span");
        name.className = "deck-name";
        name.textContent = deck.name;

        const date = document.createElement("span");
        date.className = "deck-date";
        date.textContent = "Created " + new Date(deck.createdAt).toLocaleDateString();

        item.append(name, date);
        list.append(item);
    }

    empty.hidden = decks.length > 0;
}

export function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", isError);
    message.hidden = false;
}

export function clearMessage() {
    message.textContent = "";
    message.hidden = true;
}