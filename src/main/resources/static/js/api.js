export class ApiError extends Error {
    constructor(status, message, fieldErrors) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

async function request(method, path, body) {
    const options = { method, headers: {} };
    if (body !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(path, options);

    if (!response.ok) {
        let message = `Request failed (${response.status})`;
        let fieldErrors = {};
        try {
            const error = await response.json();
            if (error.message) {
                message = error.message;
            }
            if (error.fieldErrors) {
                fieldErrors = error.fieldErrors;
            }
        } catch {

        }
        throw new ApiError(response.status, message, fieldErrors);
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}



export function fetchDecks() {
    return request("GET", "/api/decks");
}

export function createDeck(name) {
    return request("POST", "/api/decks", { name });
}

export function renameDeck(deckId, name) {
    return request("PUT", `/api/decks/${deckId}`, { name });
}

export function deleteDeck(deckId) {
    return request("DELETE", `/api/decks/${deckId}`);
}



export function fetchCards(deckId) {
    return request("GET", `/api/decks/${deckId}/cards`);
}

export function createCard(deckId, question, answer) {
    return request("POST", `/api/decks/${deckId}/cards`, { question, answer });
}

export function updateCard(deckId, cardId, question, answer) {
    return request("PUT", `/api/decks/${deckId}/cards/${cardId}`, { question, answer });
}

export function deleteCard(deckId, cardId) {
    return request("DELETE", `/api/decks/${deckId}/cards/${cardId}`);
}

export function rateCard(deckId, cardId, rating) {
    return request("POST", `/api/decks/${deckId}/cards/${cardId}/reviews`, { rating });

}