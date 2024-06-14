import { Invaders } from "./Invaders.js"
import { Shooter } from "./Shooter.js"
import { Laser } from "./Laser.js"; 
import { GameTimer } from "./GameTimer.js";
import { GameUI } from "./GameUI.js";

export class Game {
    constructor() {
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

        this.result = document.querySelector('.result');
        this.currentShooterIndex = 202;
        this.width = 15;
        this.invadersRemoved = [];
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.reqFrameId = null;
        this.alienInvaders = []
        this.aliveInvaders = []
        this.alienInvadersCopy = []
        this.invaders = null;
        this.shooter = null;
        this.gameTimer = new GameTimer();
        this.bossDamage = null
        this.bossHp = 1
        this.level = 1
        this.pause = false;

        this.gameTimer = new GameTimer()
        this.gameUI = new GameUI()
        this.squares = null

        // opponent
        this.invaderLaserSpeed = 10
        this.invaderFrequency = 100
        this.movementSpeed = 1000
        this.boss = false

        // boss
        this.bossHp = 1
        this.bossDamage = 0.05


        this.bindEventListeners()
        
    }

    bindEventListeners() {
        this.playButton.addEventListener('click', () => this.startGame())
        this.restartButton.addEventListener('click', () => this.restartGame())
        this.nextLevel.addEventListener('click', () => this.initializeGame())
        this.openDialogButton.addEventListener('click', () => this.initializePauseMenu())
        this.continueGameButton.addEventListener('click', () => this.continueGame())
    }

    initializePauseMenu() {
        this.pauseGame()
        this.dialog.showModal();
    }

    continueGame() {

        this.dialog.close()
        this.gameTimer.start()
        this.invaders.resume();
        this.shooter.resume()

    }

    //TODO: 
    //Restart Score
    //Refactor
    restartGame() {
        this.restart()
        this.level = 1;
        Laser.score = 0;
        this.scoreDisplay.innerHTML = 0;
        this.dialog.close();
        this.gameTimer.reset()
        this.initializeGame()
    }


    pauseGame() {
        this.gameTimer.pause();
        this.shooter.pause()
        this.invaders.pause()
    }

    startGame() {
        // Hide the start screen if it is visible
        let backgroundMusic = document.querySelector('#audio')
        backgroundMusic.volume = 0.4
        backgroundMusic.play()
        this.gameUI.showStartScreen()
        this.loaderLogic()
    }

    loaderLogic() {
        let beep = new Audio('../sounds/beep2.mp3')
        beep.volume = 0.5
        this.gameUI.showLoader()
        let countdown = 3;
        // let countdown = 3;

        const countdownInterval = setInterval(() => {
            this.loader.textContent = countdown;
            countdown--;

            if (countdown < 0) {
                this.gameTimer.start()
                clearInterval(countdownInterval);
                let beep = new Audio('../sounds/beep.mp3')
                beep.volume = 0.5
                beep.play()
                this.gameUI.showGameContent()
                this.initializeGame();
            } else {
                beep.play()
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
        if (this.level != 1) {
            // after every level it resets every eventlistener and such from previous classes
            this.restart()
        }
        if (this.level === 1) {
            this.setUp()
            this.playLevel()
        } else if (this.level > 1 && this.level !== 2) {
            this.setUp()
            this.playLevel()
        } else if (this.level === 2) { // boss is out at level 2 atm
            this.setUp()
            this.bossLevel()
        }
    }

    restart() {
        // resets everything still running
        if (this.invaders) {
            this.invaders.stop()
        }
        if (this.shooter) {
            this.shooter.stop()
        }
        // resets game-content grid
        this.grid.innerHTML = ''
        this.invadersRemoved = []

        document.removeEventListener('keydown', this.shooter.checkKeys)
        document.removeEventListener('keyup', this.shooter.checkKeys)

    }

    setUp() {
        // logic for harder opponents over time
        if (this.level > 2) {
            this.invaderLaserSpeed = (this.invaderLaserSpeed > 5) ? this.invaderLaserSpeed - 1 : this.invaderLaserSpeed
            this.invaderFrequency = (this.invaderFrequency > 10) ? this.invaderFrequency - 10 : this.invaderFrequency
            this.movementSpeed = (this.movementSpeed > 200) ? this.movementSpeed - 100 : this.movementSpeed
        }

        // new game-content grid
    }

    makeGameSquares() {
        this.boss = false
        this.grid.innerHTML = ''; // Clear any previous grid
        for (let i = 0; i < this.width * this.width; i++) {
            const square = document.createElement('div');
            this.grid.appendChild(square);
        }

        this.squares = Array.from(document.querySelectorAll('.game-board div'));
        this.currentShooterIndex = 202
        if (this.level === 1 || this.level > 2) {        return squares
    }


        playLevel() {
        const squares = this.makeGameSquares()
        this.alienInvaders = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
            ]
        }
        if (this.level === 2) {
            // different placement for boss
            this.alienInvaders = [
                0, 1, 2, 3, 4, 5, 6,
                15, 16, 17, 18, 19, 20, 21,
                30, 31, 32, 33, 34, 35, 36,
            ]
        }
        // shows only game content

        this.gameUI.showGameContent()


        // if (this.level === 1) {
        //     this.alienInvaders = [6]
        // }
    }

    playLevel() {
        if (this.boss) {
            // if we came from boss it resets to correct invaderFrequency
            this.invaderFrequency = 90
            this.movementSpeed = 900
            this.boss = false
        }
        this.invaders = new Invaders(this.squares, this.alienInvaders, this.invadersRemoved, this.width, this.currentShooterIndex, this.gameContent, this.result, this.resultScreen, this.invaderLaserSpeed, this.invaderFrequency, this.movementSpeed, this, this.bossHp);
        this.shooter = new Shooter(this.squares, this.currentShooterIndex, this.width, this.invadersRemoved, this, this.bossHp, this.bossDamage);
        this.invaders.move();
    }

    bossLevel() {
        this.boss = true
        this.invaderFrequency = 10
        this.movementSpeed = 750
        this.invaders = new Invaders(this.squares, this.alienInvaders, this.invadersRemoved, this.width, this.currentShooterIndex, this.gameContainer, this.result, this.resultScreen, this.invaderLaserSpeed, this.invaderFrequency, this.movementSpeed, this, this.bossHp);
        this.shooter = new Shooter(this.squares, this.currentShooterIndex, this.width, this.invadersRemoved, this, this.bossHp, this.bossDamage);
        this.invaders.move();
    }

    start() {
        this.reqFrameId = requestAnimationFrame(() => this.updateFPS());
    }

    stop() {
        cancelAnimationFrame(this.reqFrameId)
    }
}