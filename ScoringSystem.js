export class ScoringSystem {
    constructor() {
        this.score = 0;
        this.scoreDisplay = document.getElementById('scoreDisplay');
    }

    hit() {
        this.score += 1;
        this.updateScoreDisplay();
    }

    resetScore() {
        this.score = 0;
        this.updateScoreDisplay();
    }

    checkScore() {
        return this.score;
    }
    
    updateScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.innerHTML = `Score: ${this.score}`;
        }
    }
}