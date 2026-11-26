export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
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
        try {
            const error = await response.json();
            if (error.message) {
                message = error.message;
            }
        } catch {
            
        }
        throw new ApiError(response.status, message);
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