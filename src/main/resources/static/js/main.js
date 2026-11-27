import {
    fetchDecks, createDeck, renameDeck, deleteDeck,
    fetchCards, createCard, updateCard, deleteCard,
} from "./api.js";
import {
    renderDecks, setDeckFormMode,
    showCardPanel, setCardPanelTitle, hideCardPanel, renderCards, setCardFormMode,
    showMessage, clearMessage, clearFieldError
} from "./ui.js";

const deckForm = document.querySelector("#deck-form");
const deckNameInput = document.querySelector("#deck-name");
const deckCancel = document.querySelector("#deck-cancel");
const deckList = document.querySelector("#deck-list");


const cardForm = document.querySelector("#card-form");
const questionInput = document.querySelector("#card-question");
const answerInput = document.querySelector("#card-answer");
const cardCancel = document.querySelector("#card-cancel");
const cardList = document.querySelector("#card-list");


let decks = [];
let selectedDeckId = null;
let editingDeckId = null;
let cards = [];
let editingCardId = null;

async function loadDecks() {
    try {
        decks = await fetchDecks();
        renderDecks(decks, selectedDeckId);
    } catch (error) {
        console.error(error);
        showMessage("deck", "Could not load decks: " + error.message, true);
    }
}

async function handleDeckSubmit(event) {
    event.preventDefault();
    clearMessage("deck");

    try {
        if (editingDeckId === null) {
            const deck = await createDeck(deckNameInput.value);
            showMessage("deck", `Deck "${deck.name}" created.`, false);
        } else {
            const deck = await renameDeck(editingDeckId, deckNameInput.value);
            showMessage("deck", `Deck renamed to "${deck.name}".`, false);
            if (deck.id === selectedDeckId) {
                setCardPanelTitle(deck.name);
            }
            editingDeckId = null;
        }
        setDeckFormMode(null);
        await loadDecks();
    } catch (error) {
        console.error(error);
        showMessage("deck", error.message, true);
    }
    deckNameInput.focus();
}

function startRenameDeck(deckId) {
    editingDeckId = deckId;
    const deck = decks.find((d) => d.id === deckId);
    setDeckFormMode(deck);
    clearMessage("deck");
    deckNameInput.focus();
}

function cancelDeckEdit() {
    editingDeckId = null;
    setDeckFormMode(null);
    clearMessage("deck");
}

async function handleDeleteDeck(deckId) {
    const deck = decks.find((d) => d.id === deckId);
    if (!confirm(`Delete the deck "${deck.name}" and all its cards?`)) {
        return;
    }

    try {
        await deleteDeck(deckId);
        if (deckId === selectedDeckId) {
            selectedDeckId = null;
            hideCardPanel();
        }
        if (deckId === editingDeckId) {
            cancelDeckEdit();
        }
        showMessage("deck", `Deck "${deck.name}" deleted.`, false);
        await loadDecks();
    } catch (error) {
        console.error(error);
        showMessage("deck", error.message, true);
    }
}

function selectDeck(deckId) {
    selectedDeckId = deckId;
    const deck = decks.find((d) => d.id === deckId);

    editingCardId = null;
    setCardFormMode(null);
    renderDecks(decks, selectedDeckId);
    showCardPanel(deck);
    clearMessage("card");
    loadCards();
}


function handleDeckClick(event) {

    const action = event.target.closest("[data-action]");
    if (action) {
        const deckId = Number(action.dataset.deckId);
        if (action.dataset.action === "rename") {
            startRenameDeck(deckId);
        } else if (action.dataset.action === "delete") {
            handleDeleteDeck(deckId);
        }
        return;
    }

    const selectButton = event.target.closest("[data-deck-id]");
    if (selectButton) {
        selectDeck(Number(selectButton.dataset.deckId));
    }
}

async function loadCards() {
    try {
        cards = await fetchCards(selectedDeckId);
        renderCards(cards, editingCardId);
    } catch (error) {
        console.error(error);
        showMessage("card", "Could not load cards: " + error.message, true);
    }
}

async function handleCardSubmit(event) {
    event.preventDefault();
    clearMessage("card");

    try {
        if (editingCardId === null) {
            await createCard(selectedDeckId, questionInput.value, answerInput.value);
            showMessage("card", "Card added.", false);
        } else {
            await updateCard(selectedDeckId, editingCardId, questionInput.value, answerInput.value);
            showMessage("card", "Card updated.", false);
            editingCardId = null;
        }
        setCardFormMode(null);
        await loadCards();
    } catch (error) {
        console.error(error);
        showMessage("card", error.message, true);
    }

    questionInput.focus();
}

function startEditCard(cardId) {
    editingCardId = cardId;
    const card = cards.find((c) => c.id === cardId);
    setCardFormMode(card);
    renderCards(cards, editingCardId);
    clearMessage("card");
    questionInput.focus();
}

function cancelCardEdit() {
    editingCardId = null;
    setCardFormMode(null);
    renderCards(cards, editingCardId);
    clearMessage("card");
}

async function handleDeleteCard(cardId) {
    if (!confirm("Delete this card?")) {
        return;
    }

    try {
        await deleteCard(selectedDeckId, cardId);
        if (cardId === editingCardId) {
            editingCardId = null;
            setCardFormMode(null);
        }
        showMessage("card", "Card deleted.", false);
        await loadCards();
    } catch (error) {
        console.error(error);
        showMessage("card", error.message, true);
    }
}

function handleCardClick(event) {
    const action = event.target.closest("[data-action]");
    if (!action) {
        return;
    }

    const cardId = Number(action.dataset.cardId);
    if (action.dataset.action === "edit") {
        startEditCard(cardId);
    } else if (action.dataset.action === "delete") {
        handleDeleteCard(cardId);
    }
}


deckForm.addEventListener("submit", handleDeckSubmit);
deckForm.addEventListener("input", (event) => clearFieldError("deck", event.target.name));
deckCancel.addEventListener("click", cancelDeckEdit);
deckList.addEventListener("click", handleDeckClick);

cardForm.addEventListener("submit", handleCardSubmit);
cardForm.addEventListener("input", (event) => clearFieldError("card", event.target.name));
cardCancel.addEventListener("click", cancelCardEdit);
cardList.addEventListener("click", handleCardClick);
loadDecks();