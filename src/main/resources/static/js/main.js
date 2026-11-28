import {
    fetchDecks, createDeck, renameDeck, deleteDeck,
    fetchCards, createCard, updateCard, deleteCard,
    rateCard,
} from "./api.js";
import { StudySession } from "./study.js";
import {
    renderDecks, setDeckFormMode,
    showCardPanel, setCardPanelTitle, hideCardPanel, renderCards, setCardFormMode,
    showMessage, clearMessage, showFieldErrors, clearFieldErrors, clearFieldError,
    showStudyPanel, hideStudyPanel, renderStudy, focusStudyCard, focusStudyStart,
    setRatingBusy,
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

const studyStart = document.querySelector("#study-start");
const studyStop = document.querySelector("#study-stop");
const studyCard = document.querySelector("#study-card");
const studyFlip = document.querySelector("#study-flip");
const studyPrev = document.querySelector("#study-prev");
const studyNext = document.querySelector("#study-next");
const studyAgain = document.querySelector("#study-again");
const studyBackToDecks = document.querySelector("#study-back-to-decks");
const ratingButtons = document.querySelector("#rating-buttons");

const RATING_KEYS = { 1: "AGAIN", 2: "HARD", 3: "GOOD", 4: "EASY" };


let decks = [];
let selectedDeckId = null;
let editingDeckId = null;
let cards = [];
let editingCardId = null;
let session = null;
let savingRating = false;



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
    clearFieldErrors("deck");

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
        showFieldErrors("deck", error.fieldErrors ?? {});
    }

    deckNameInput.focus();
}

function startRenameDeck(deckId) {
    editingDeckId = deckId;
    const deck = decks.find((d) => d.id === deckId);
    setDeckFormMode(deck);
    clearMessage("deck");
    clearFieldErrors("deck");
    deckNameInput.focus();
}

function cancelDeckEdit() {
    editingDeckId = null;
    setDeckFormMode(null);
    clearMessage("deck");
    clearFieldErrors("deck");
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
    clearFieldErrors("card");
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
    clearFieldErrors("card");

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
        showFieldErrors("card", error.fieldErrors ?? {});
    }

    questionInput.focus();
}

function startEditCard(cardId) {
    editingCardId = cardId;
    const card = cards.find((c) => c.id === cardId);
    setCardFormMode(card);
    renderCards(cards, editingCardId);
    clearMessage("card");
    clearFieldErrors("card");
    questionInput.focus();
}

function cancelCardEdit() {
    editingCardId = null;
    setCardFormMode(null);
    renderCards(cards, editingCardId);
    clearMessage("card");
    clearFieldErrors("card");
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

function handleDeckKey(event) {
    if (event.key === "Escape" && editingDeckId !== null) {
        cancelDeckEdit();
    }
}

function handleCardKey(event) {
    if (event.key === "Escape" && editingCardId !== null) {
        cancelCardEdit();
    }
}


function startStudy() {
    if (cards.length === 0) {
        return;
    }
    session = new StudySession(cards);
    const deck = decks.find((d) => d.id === selectedDeckId);
    showStudyPanel(deck.name);
    renderStudy(session, true);
    focusStudyCard();
}

function flipCard() {
    session.flip();
    renderStudy(session, false);
}

function nextCard() {
    session.next();
    renderStudy(session, true);
}

function previousCard() {
    session.previous();
    renderStudy(session, true);
}

async function rateCurrentCard(rating) {
    if (session === null || session.finished || !session.flipped || savingRating) {
        return;
    }

    savingRating = true;
    setRatingBusy(true);
    clearMessage("study");

    try {
        await rateCard(selectedDeckId, session.card.id, rating);
        session.rate(rating);
        renderStudy(session, true);
    } catch (error) {
        console.error(error);
        showMessage("study", "Could not save the rating: " + error.message, true);
    } finally {
        savingRating = false;
        setRatingBusy(false);
    }
}

function handleRatingClick(event) {
    const button = event.target.closest("[data-rating]");
    if (button) {
        rateCurrentCard(button.dataset.rating);
    }
}

function endStudy() {
    session = null;
    hideStudyPanel();
    focusStudyStart();
}

function handleStudyKey(event) {
    if (session === null) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        endStudy();
        return;
    }

    if (session.finished) {
        return;
    }

    if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        flipCard();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextCard();
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousCard();
    } else if (event.key in RATING_KEYS && session.flipped) {
        event.preventDefault();
        rateCurrentCard(RATING_KEYS[event.key]);
    }
}

deckForm.addEventListener("submit", handleDeckSubmit);
deckCancel.addEventListener("click", cancelDeckEdit);
deckList.addEventListener("click", handleDeckClick);

cardForm.addEventListener("submit", handleCardSubmit);
cardCancel.addEventListener("click", cancelCardEdit);
cardList.addEventListener("click", handleCardClick);

deckForm.addEventListener("input", (event) => clearFieldError("deck", event.target.name));
deckForm.addEventListener("keydown", handleDeckKey);
cardForm.addEventListener("input", (event) => clearFieldError("card", event.target.name));
cardForm.addEventListener("keydown", handleCardKey);

studyStart.addEventListener("click", startStudy);
studyStop.addEventListener("click", endStudy);
studyCard.addEventListener("click", flipCard);
studyFlip.addEventListener("click", flipCard);
studyPrev.addEventListener("click", previousCard);
studyNext.addEventListener("click", nextCard);
studyAgain.addEventListener("click", startStudy);
studyBackToDecks.addEventListener("click", endStudy);
ratingButtons.addEventListener("click", handleRatingClick);
document.addEventListener("keydown", handleStudyKey);

loadDecks();