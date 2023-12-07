//import { RotateAnimator } from "./common/engine/animators/RotateAnimator";
//import { Transform } from "./common/engine/core";
//import { ScoringSystem } from './ScoringSystem.js';

export class GameOver {
    constructor(pigeon, scoringSystem) {
        this.isGameOver = false;
        this.pigeon = pigeon;
        this.scoringSystem = scoringSystem;

        // Bind the resetGame function to the current instance, so it can be used in event listeners
        this.resetGame = this.resetGame.bind(this);
    }

    endGame() {
        this.isGameOver = true;
        console.log("GAME OVER!");

        // Show the pop-up
        const popup = document.getElementById('gameOverPopup');
        const scoreDisplay = popup.querySelector('#finalScore'); // Add an element with id 'finalScore' to your popup
    
        // Display the final score
        //this.scoringSystem.updateScoreDisplay(); // Ensure the display is updated
        scoreDisplay.textContent = `Final Score: ${this.scoringSystem.checkScore()}`;
        popup.style.display = 'block';

        // Add event listener to the restart button
        const restartButton = document.getElementById('restartButton');
        restartButton.addEventListener('click', this.resetGame);
    }

        
    resetGame() {
        this.isGameOver = false;

        // Hide the pop-up
        const popup = document.getElementById('gameOverPopup');
        popup.style.display = 'none';

        window.location.href = "index.html";
    }

    checkGameOver() {
        return this.isGameOver;
    }
}
