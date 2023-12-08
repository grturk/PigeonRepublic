;

export class GameOver {
    constructor(scoringSystem) {
        this.isGameOver = false;
        this.scoringSystem = scoringSystem
    }

    endGame() {
        this.isGameOver = true;
        // console.log("GAME OVER!");

        document.getElementById('finalScore').textContent = `Score: ${this.scoringSystem.checkScore()}`;
        document.querySelector('.fullscreen').style.display = 'none';
        document.getElementById('gameOverPopup').style.display = 'block';

        document.getElementById('restartButton').addEventListener('click', function() {
            //location.reload(false);          
            location.replace(location.href);
            //history.go(0);
            //location.href = location.href;
        });
    }

    resetGame() {
        this.isGameOver = false;
    }

    checkGameOver() {
        return this.isGameOver;
    }
}