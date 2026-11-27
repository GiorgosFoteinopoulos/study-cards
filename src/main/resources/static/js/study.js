function shuffled(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export class StudySession {
    #cards;
    #index = 0;
    #flipped = false;
    #revealed = new Set();

    constructor(cards) {
        if (cards.length === 0) {
            throw new Error("A study session needs at least one card");
        }
        this.#cards = shuffled(cards);
    }

    get card() {
        return this.#cards[this.#index];
    }

    get position() {
        return this.#index + 1;
    }

    get total() {
        return this.#cards.length;
    }

    get flipped() {
        return this.#flipped;
    }

    get isFirst() {
        return this.#index === 0;
    }

    get isLast() {
        return this.#index === this.#cards.length - 1;
    }

    get revealedCount() {
        return this.#revealed.size;
    }

    get finished() {
        return this.#index >= this.#cards.length;
    }

    flip() {
        if (!this.finished) {
            this.#flipped = !this.#flipped;
            if (this.#flipped) {
                this.#revealed.add(this.card.id);
            }
        }
    }

    next() {
        if (!this.finished) {
            this.#index++;
            this.#flipped = false;
        }
    }

    previous() {
        if (this.#index > 0) {
            this.#index--;
            this.#flipped = false;
        }
    }
}