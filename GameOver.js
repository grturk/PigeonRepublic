

export class GameOver {
    constructor(scoringSystem) {
        this.isGameOver = false;
        this.scoringSystem = scoringSystem
    }

    endGame() {
        this.isGameOver = true;
        // console.log("GAME OVER!");

        document.getElementById('finalScore').textContent = `You ruined ${this.scoringSystem.checkScore()} people's day. Congrats!!`;
        document.querySelector('.fullscreen').style.display = 'none';
        document.getElementById('gameOverPopup').style.display = 'block';

        document.getElementById('restartButton').addEventListener('click', function() {
            //location.reload(false);          
            location.replace(location.href);
        });
    }

    resetGame() {
        this.isGameOver = false;
    }

    checkGameOver() {
        return this.isGameOver;
    }
}