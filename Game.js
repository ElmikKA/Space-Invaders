import { Invaders } from "./Invaders.js"
import { Shooter } from "./Shooter.js"
import { Laser } from "./Laser.js";

export class Game {
    constructor() {
        this.grid = document.querySelector('.game-board');
        this.playButton = document.getElementById('play-button');
        this.startScreen = document.querySelector('.start-screen');
        this.loader = document.getElementById('loader');
        this.gameContent = document.querySelector('.game-content');
        this.gameContainer = document.querySelector('.game-container');
        this.restartButton = document.getElementById('restart-button');
        this.resultScreen = document.querySelector('.result-screen');
        this.result = document.querySelector('.result');
        this.currentShooterIndex = 202;
        this.width = 15;
        this.invadersRemoved = [];
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.reqFrameId = null;

        this.invaders = null;
        this.shooter = null;

        this.playButton.addEventListener('click', () => this.startGame())
        this.restartButton.addEventListener('click', () => window.location.reload())
    }

    startGame() {
        // Hide the start screen if it is visible
        this.startScreen.style.display = 'none';
        this.loaderLogic()
    }

    loaderLogic() {
        this.loader.style.display = 'flex';
        let countdown = 3;

        const countdownInterval = setInterval(() => {
            this.loader.textContent = countdown;
            countdown--;

            if (countdown < 0) {
                clearInterval(countdownInterval);
                this.loader.style.visibility = 'hidden';
                this.gameContent.style.visibility = 'visible';
                this.initializeGame();
            }
        }, 1000);
    }

    updateFPS() {
        const currentFrameTime = performance.now();
        const delta = currentFrameTime - this.lastFrameTime;
        this.frameCount++;
        if (delta >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = currentFrameTime;
        }

        document.getElementById('fps-counter').innerText = `FPS: ${this.fps}`;
        this.reqFrameId = requestAnimationFrame(() => this.updateFPS());
    }

    initializeGame() {
        this.grid.innerHTML = ''; // Clear any previous grid
        for (let i = 0; i < this.width * this.width; i++) {
            const square = document.createElement('div');
            this.grid.appendChild(square);
        }

        const squares = Array.from(document.querySelectorAll('.game-board div'));
        const alienInvaders = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        ];

        this.invaders = new Invaders(squares, alienInvaders, this.invadersRemoved, this.width, this.currentShooterIndex, this.gameContainer, this.result, this.resultScreen);
        this.shooter = new Shooter(squares, this.currentShooterIndex, this.width, alienInvaders, this.invadersRemoved);
        this.invaders.move();
        this.shooter.initEvent();
    }

    start() {
        this.reqFrameId = requestAnimationFrame(() => this.updateFPS());
    }

    stop() {
        cancelAnimationFrame(this.reqFrameId)
    }
}