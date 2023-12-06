//import { RotateAnimator } from "./common/engine/animators/RotateAnimator";
//import { Transform } from "./common/engine/core";

export class GameOver {
    constructor(pigeon) {
        this.isGameOver = false;
        this.pigeon = pigeon;

        // Bind the resetGame function to the current instance, so it can be used in event listeners
        this.resetGame = this.resetGame.bind(this);
    }

    endGame() {
        this.isGameOver = true;
        console.log("GAME OVER!");

        // Show the pop-up
        const popup = document.getElementById('gameOverPopup');
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
