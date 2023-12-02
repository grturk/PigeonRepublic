//import { RotateAnimator } from "./common/engine/animators/RotateAnimator";
//import { Transform } from "./common/engine/core";

export class GameOver {
    constructor(pigeon) {
        this.isGameOver = false;
        this.pigeon = pigeon;
    }

    endGame() {
        this.isGameOver = true;
        console.log("GAME OVER!");
        // Lahko se naredi animacija da golob pade
        // const pigeonTransform = this.pigeon.getComponentOfType(Transform);
        // const pigeonRotator = this.pigeon.getComponentOfType(RotateAnimator);
        
    }

    resetGame() {
        this.isGameOver = false;
    }

    checkGameOver() {
        return this.isGameOver;
    }
}