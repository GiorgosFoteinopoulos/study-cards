import { fetchDecks, createDeck, fetchCards, createCard } from "./api.js";
import { renderDecks, showCardPanel, renderCards, showMessage, clearMessage } from "./ui.js";

const deckForm = document.querySelector("#deck-form");
const deckNameInput = document.querySelector("#deck-name");
const deckList = document.querySelector("#deck-list");


const cardForm = document.querySelector("#card-form");
const questionInput = document.querySelector("#card-question");
const answerInput = document.querySelector("#card-answer");


let decks = [];
let selectedDeckId = null;

async function loadDecks() {
    try {
        decks = await fetchDecks();
        renderDecks(decks, selectedDeckId);
    } catch (error) {
        console.error(error);
        showMessage("deck", "Could not load decks: " + error.message, true);
    }
}

async function handleCreateDeck(event) {
    event.preventDefault();
    clearMessage("deck");

    try {
        const deck = await createDeck(deckNameInput.value);
        deckNameInput.value = "";
        showMessage("deck", `Deck "${deck.name}" created.`, false);
        await loadDecks();
    } catch (error) {
        console.error(error);
        showMessage("deck", error.message, true);
    }

    deckNameInput.focus();
}


function handleDeckClick(event) {
    const button = event.target.closest("[data-deck-id]");
    if (!button) {
        return;
    }

    selectedDeckId = Number(button.dataset.deckId);
    const deck = decks.find((d) => d.id === selectedDeckId);

    renderDecks(decks, selectedDeckId);
    showCardPanel(deck);
    clearMessage("card");
    loadCards();
}

async function loadCards() {
    try {
        const cards = await fetchCards(selectedDeckId);
        renderCards(cards);
    } catch (error) {
        console.error(error);
        showMessage("card", "Could not load cards: " + error.message, true);
    }
}

async function handleCreateCard(event) {
    event.preventDefault();
    clearMessage("card");

    try {
        await createCard(selectedDeckId, questionInput.value, answerInput.value);
        questionInput.value = "";
        answerInput.value = "";
        showMessage("card", "Card added.", false);
        await loadCards();
    } catch (error) {
        console.error(error);
        showMessage("card", error.message, true);
    }
    questionInput.focus();
}

deckForm.addEventListener("submit", handleCreateDeck);
deckList.addEventListener("click", handleDeckClick);
cardForm.addEventListener("submit", handleCreateCard);
loadDecks();