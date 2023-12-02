
export class ScoringSytem {
    constructor() {
        this.score = 0;
    }

    hit() {
        this.score += 1;
    }

    resetScore() {
        this.score = 0;
    }

    checkScore() {
        return this.score;
    }
}