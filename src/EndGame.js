
export class EndGame {
    constructor(gameUI, gameTimer) {
        this.gameUI = gameUI;
        this.gameTimer = gameTimer;
    }

    handleWin(game) {
        this.gameUI.showResultScreen(true);
        game.result.textContent = 'YOU HAVE WON';
        game.level += 1;
        this.stopGame(game);
        console.log(`Level: ${game.level}`);
    }

    handleLoss(game) {
        this.gameUI.showResultScreen(false);
        game.result.textContent = 'YOU HAVE LOST';
        this.stopGame(game);
    }

    stopGame(game) {
        if (game.invaders) {
            game.invaders.stop();
        }
        if (game.shooter) {
            game.shooter.stop();
        }
    }
}