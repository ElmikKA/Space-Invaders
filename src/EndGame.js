
export class EndGame {
    constructor(gameUI) {
        this.gameUI = gameUI;
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
        game.result.textContent = 'GAME OVER';
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