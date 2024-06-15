import { Invaders } from "./Invaders.js"
import { Shooter } from "./Shooter.js"
import { Laser } from "./Laser.js"; 
import { GameTimer } from "./GameTimer.js";
import { GameUI } from "./GameUI.js";
import { EndGame } from "./EndGame.js";
import { SoundManager } from "./SoundManager.js";
import { FPSCounter } from "./FPSCounter.js";
import { LevelManager } from "./LevelManager.js";

export class Game {
    constructor() {
        this.initializeElements();
        this.initializeProperties();
        this.bindEventListeners();
        this.storeInitialHeartState();
    }

    initializeElements() {
        this.grid = document.querySelector('.game-board');
        this.playButton = document.getElementById('play-button');
        this.startScreen = document.querySelector('.start-screen');
        this.loader = document.getElementById('loader');
        this.gameContent = document.querySelector('.game-content');
        this.restartButton = document.getElementById('restart-button');
        this.nextLevel = document.getElementById('next-level')
        this.resultScreen = document.querySelector('.result-screen');
        this.dialog = document.querySelector('#pause-menu-dialog');
        this.openDialogButton = document.querySelector('#open-menu-button');
        this.continueGameButton = document.querySelector('#continue-game-button');
        this.scoreDisplay = document.querySelector('.score');
        this.playAgainButton = document.querySelector('#play-again-button');
        this.heartsContainer = document.querySelector('.hearts');
        this.result = document.querySelector('.result');
    }

    initializeProperties() {
        this.currentShooterIndex = 202;
        this.width = 15;
        this.invadersRemoved = [];
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.reqFrameId = null;
        this.alienInvaders = [];
        this.aliveInvaders = [];
        this.alienInvadersCopy = [];
        this.invaders = null;
        this.shooter = null;
        this.bossDamage = null;
        this.bossHp = 1,
        this.level = 1;
        this.pause = false; 

        this.gameTimer = new GameTimer();
        this.gameUI = new GameUI();
        this.endGame = new EndGame(this.gameUI, this.gameTimer)
        this.squares = null;

        // opponent
        this.invaderLaserSpeed = 10;
        this.invaderFrequency = 100;
        this.movementSpeed = 1000;
        this.boss = false;

        // boss
        this.bossHp = 1;
        this.bossDamage = 0.05;
        this.soundManager = new SoundManager();
        this.levelManager = new LevelManager(this.width);
        this.fpsCounter = new FPSCounter();
    }

    bindEventListeners() {
        this.playButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.nextLevel.addEventListener('click', () => this.initializeGame());
        this.openDialogButton.addEventListener('click', () => this.initializePauseMenu());
        this.continueGameButton.addEventListener('click', () => this.continueGame());
        this.playAgainButton.addEventListener('click', () => this.playAgain())
    }

    storeInitialHeartState() {
        this.initialHeartState = {
            innerHTML: this.heartsContainer.innerHTML,
        };
    }

    resetHearts() {
        this.heartsContainer.innerHTML = this.initialHeartState.innerHTML;
    }

    initializePauseMenu() {
        this.pauseGame();
        this.dialog.showModal();
    }

    continueGame() {
        this.dialog.close();
        this.gameTimer.start();
        this.invaders.resume();
        this.shooter.resume();
    }

    restartGame() {
        this.restart()
        this.level = 1;
        Laser.score = 0;
        this.scoreDisplay.innerHTML = 0;
        this.dialog.close();
        this.gameTimer.reset();
        this.resetHearts()
        this.initializeGame();
    }

    pauseGame() {
        this.gameTimer.pause();
        this.shooter.pause();
        this.invaders.pause();
    }

    playAgain() {
        this.restart();
        this.level = 1;
        Laser.score = 0;
        this.scoreDisplay.innerHTML = 0;
        this.resetHearts()
        this.startGame();
    }

    startGame() {
        // Hide the start screen if it is visible
        this.soundManager.playBackgroundMusic()
        this.gameUI.showStartScreen();
        this.loaderLogic();
    }

    loaderLogic() {
        this.soundManager.playBeepSound2;
        this.gameUI.showLoader();
        let countdown = 3;

        const countdownInterval = setInterval(() => {
            this.loader.textContent = countdown;
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                this.startGameAfterLoader()
            } else {
                this.soundManager.playBeepSound()
            }
        }, 1000);
    }

    startGameAfterLoader() {
        this.gameTimer.reset()
        this.gameTimer.start();
        this.soundManager.playBeepSound();
        this.gameUI.showGameContent();
        this.initializeGame();
    }

    updateFPS() {
        this.fpsCounter.updateFPS()
    }

    initializeGame() {
        if (this.level != 1) {
            // after every level it resets every eventlistener and such from previous classes
            this.restart();
        }
        this.setUp();
        this.level === 2 ? this.bossLevel() : this.playLevel()
    }

    restart() {
        // resets everything still running
        if (this.invaders) this.invaders.stop();
        if (this.shooter) this.shooter.stop();
        // resets game-content grid
        this.grid.innerHTML = '';
        this.invadersRemoved = [];
        document.removeEventListener('keydown', this.shooter.checkKeys);
        document.removeEventListener('keyup', this.shooter.checkKeys);
    }

    makeGameSquares() {
        this.grid.innerHTML = ''; // Clear any previous grid
        for (let i = 0; i < this.width * this.width; i++) {
            const square = document.createElement('div');
            this.grid.appendChild(square);
        }
        this.squares = Array.from(document.querySelectorAll('.game-board div'));
    }

    setUp() {
        // logic for harder opponents over time
        const { invaderLaserSpeed, invaderFrequency, movementSpeed } = this.levelManager.adjustDifficulty(this.level, this.invaderLaserSpeed, this.invaderFrequency, this.movementSpeed);
        this.invaderLaserSpeed = invaderLaserSpeed;
        this.invaderFrequency = invaderFrequency;
        this.movementSpeed = movementSpeed;
        this.makeGameSquares();
        this.currentShooterIndex = 202;
        this.alienInvaders = this.level === 2 ? this.levelManager.getBossInvaders() : this.levelManager.getRegularInvaders();
        this.gameUI.showGameContent();
    }

    playLevel() {
        if (this.boss) {
            // if we came from boss it resets to correct invaderFrequency
            this.invaderFrequency = 90;
            this.movementSpeed = 900;
            this.boss = false;
        }
        this.startInvaders();
    }

    bossLevel() {
        this.boss = true;
        this.invaderFrequency = 10;
        this.movementSpeed = 750;
        this.startInvaders()
    }

    startInvaders() {
        this.invaders = new Invaders(this.squares, this.alienInvaders, this.invadersRemoved, this.width, this.currentShooterIndex, this.gameContainer, this.result, this.resultScreen, this.invaderLaserSpeed, this.invaderFrequency, this.movementSpeed, this, this.bossHp, this.endGame);
        this.shooter = new Shooter(this.squares, this.currentShooterIndex, this.width, this.invadersRemoved, this, this.bossHp, this.bossDamage);
        this.invaders.move();
    }

    start() {
        this.reqFrameId = requestAnimationFrame(() => this.updateFPS());
    }

    stop() {
        cancelAnimationFrame(this.reqFrameId);
    }
}