import { fetchDecks, createDeck } from "./api.js";
import { renderDecks, showMessage, clearMessage} from "./ui.js";

const form = document.querySelector("#deck-form");
const nameInput = document.querySelector("#deck-name");

async function loadDecks() {
    try {
        const decks = await fetchDecks();
        renderDecks(decks);
    } catch (error) {
        console.error(error);
        showMessage("Could not load decks: " + error.message, true);
    }
}

async function handleCreate(event) {
    event.preventDefault();
    clearMessage();

    try {
        const deck = await createDeck(nameInput.value);
        nameInput.value = "";
        showMessage(`Deck "${deck.name}" created.`, false);
        await loadDecks();
    } catch (error) {
        console.error(error);
        showMessage(error.message, true);
    }

    nameInput.focus();
}

form.addEventListener("submit", handleCreate);
loadDecks();