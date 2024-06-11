import { Invaders } from "./Invaders.js"
import { Shooter } from "./Shooter.js"
import { GameTimer } from "./GameTimer.js";
import { Laser } from "./Laser.js";

export class Game {
    // static level = 1
    constructor() {
        this.grid = document.querySelector('.game-board');
        this.playButton = document.getElementById('play-button');
        this.startScreen = document.querySelector('.start-screen');
        this.loader = document.getElementById('loader');
        this.gameContent = document.querySelector('.game-content');
        this.gameContainer = document.querySelector('.game-container');
        this.restartButton = document.getElementById('restart-button');
        this.nextLevel = document.getElementById('next-level')
        this.resultScreen = document.querySelector('.result-screen');

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
        this.bossDamage = null
        this.bossHp = 1
        this.level = 1

        // opponent
        this.invaderLaserSpeed = 10
        this.invaderFrequency = 50
        this.movementSpeed = 1000
        this.boss = false

        this.playButton.addEventListener('click', () => this.startGame())
        this.restartButton.addEventListener('click', () => window.location.reload())
        this.nextLevel.addEventListener('click', () => this.initializeGame())
    }

    startGame() {
        // Hide the start screen if it is visible
        this.startScreen.style.display = 'none';
        this.loaderLogic()
    }

    loaderLogic() {
        this.loader.style.display = 'flex';
        let countdown = 0;
        // let countdown = 3;

        const countdownInterval = setInterval(() => {
            this.loader.textContent = countdown;
            countdown--;

            if (countdown < 0) {
                const gameTimer = new GameTimer();
                gameTimer.start()
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
        if (this.level != 1) {
            this.restart()
        }
        console.log('init')
        console.log(this.level)
        this.currentShooterIndex = 202
        Laser.isLaserActive = false
        if (this.level === 1) {
            console.log('level 1')
            this.invaderLaserSpeed = 10
            this.invaderFrequency = 50
            this.movementSpeed = 1000
            this.playLevel()
        } else if (this.level > 1 && this.level !== 2) {
            console.log(`level `, this.level)
            this.invaderLaserSpeed = (this.invaderLaserSpeed > 5) ? this.invaderLaserSpeed - 1 : (console.log('max laser speed'), this.invaderLaserSpeed)
            this.invaderFrequency = (this.invaderFrequency > 10) ? this.invaderFrequency - 10 : (console.log('max firerate'), this.invaderFrequency) // fix freq after boss
            this.movementSpeed = (this.movementSpeed > 500) ? this.movementSpeed - 250 : (console.log('max movement speed'), this.movementSpeed)
            this.playLevel()
        } else if (this.level === 2) {
            console.log('boss level')
            this.invaderLaserSpeed = 10
            this.invaderFrequency = 10
            this.movementSpeed = 1000
            this.bossLevel()
        }
    }

    restart() {
        if (this.invaders) {
            this.invaders.stop()
        }
        if (this.shooter) {
            this.shooter.stop()
        }
        this.grid.innerHTML = ''
        this.invadersRemoved = []

        document.removeEventListener('keydown', this.shooter.checkKeys)
        document.removeEventListener('keyup', this.shooter.checkKeys)
    }

    playLevel() {
        this.boss = false
        this.grid.innerHTML = ''; // Clear any previous grid
        for (let i = 0; i < this.width * this.width; i++) {
            const square = document.createElement('div');
            this.grid.appendChild(square);
        }

        const squares = Array.from(document.querySelectorAll('.game-board div'));

        this.alienInvaders = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        ]

        // this.alienInvaders = [6]
        this.gameContainer.style.display = 'flex'
        this.resultScreen.style.display = 'none'
        this.invaders = new Invaders(squares, this.alienInvaders, this.invadersRemoved, this.width, this.currentShooterIndex, this.gameContainer, this.result, this.resultScreen, this.invaderLaserSpeed, this.invaderFrequency, this.movementSpeed, this, this.bossHp);
        this.shooter = new Shooter(squares, this.currentShooterIndex, this.width, this.invadersRemoved, this, this.bossHp, this.bossDamage);
        this.invaders.move();
    }

    bossLevel() {
        this.bossHp = 1
        this.bossDamage = 0.3
        this.boss = true
        this.grid.innerHTML = ''; // Clear any previous grid
        for (let i = 0; i < this.width * this.width; i++) {
            const square = document.createElement('div');
            this.grid.appendChild(square);
        }

        const squares = Array.from(document.querySelectorAll('.game-board div'));
        this.alienInvaders = [
            0, 1, 2, 3, 4, 5, 6,
            15, 16, 17, 18, 19, 20, 21,
            30, 31, 32, 33, 34, 35, 36,
        ]

        this.gameContainer.style.display = 'flex'
        this.resultScreen.style.display = 'none'

        this.invaders = new Invaders(squares, this.alienInvaders, this.invadersRemoved, this.width, this.currentShooterIndex, this.gameContainer, this.result, this.resultScreen, this.invaderLaserSpeed, this.invaderFrequency, this.movementSpeed, this, this.bossHp);
        this.shooter = new Shooter(squares, this.currentShooterIndex, this.width, this.invadersRemoved, this, this.bossHp, this.bossDamage);
        this.invaders.move();

    }

    start() {
        this.reqFrameId = requestAnimationFrame(() => this.updateFPS());
    }

    stop() {
        cancelAnimationFrame(this.reqFrameId)
    }
}