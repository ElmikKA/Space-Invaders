import { Explosion } from "./Explosion.js";
import { SoundManager } from "./SoundManager.js";

export class Laser {
    static score = 0;
    static isLaserActive = false;
    static laserSpeed = 3; // Number of frames to skip before moving

    constructor(width, squares, aliensRemoved, shooter, boss, bossHp, bossDamage, invaders) {
        this.shooter = shooter;
        this.currentLaserIndex = shooter.currentShooterIndex;
        this.width = width;
        this.squares = squares;
        this.alienInvaders = invaders.lasers.alienInvaders;
        this.aliensRemoved = aliensRemoved;
        this.reqFrameId = null;
        this.frameCount = 0;
        this.aliveInvaders = invaders.lasers.aliveInvaders;
        this.alienInvadersCopy = invaders.lasers.alienInvadersCopy;
        this.boss = boss;
        this.bossHp = bossHp;
        this.bossDamage = bossDamage;
        this.invaders = invaders;
        this.gameOnPause = false;
        this.scoreDisplay = document.querySelector('.score');
        this.lasers = [];
        this.currentFrameTime = performance.now();
        this.delta = 0;
        this.lastFrameTime = performance.now();
        this.soundManager = new SoundManager();
    }

    removeLaser(laser) {
        const index = this.lasers.indexOf(laser);
        this.lasers.splice(index, 1);
    }

    moveLaser() {
        if (this.gameOnPause) return;
        const lasersToRemove = []; // In case multiple lasers have to be removed at once
        for (let laser of this.lasers) { // moves lasers if they are in bounds
            if (laser.coords >= this.width) { // Move up by one row
                this.squares[laser.coords].classList.remove('laser');
                laser.coords -= this.width;
                this.squares[laser.coords].classList.add('laser');
                this.checkCollision(laser);
            } else {
                lasersToRemove.push(laser);// if out of bounds the laser goes into remove array
            }
        }
        for (let laser of lasersToRemove) {
            this.clearLaser(laser);
        }
    }

    animateLaser() {
        if (this.gameOnPause) return;

        //Increment the frame counter
        this.frameCount++;
        // Only move the laser every Laser.laserSpeed frames
        if (this.frameCount % Laser.laserSpeed === 0) {
            this.moveLaser();
        }

        if (this.lasers.length > 0) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser());
        } else {
            Laser.isLaserActive = false;
            cancelAnimationFrame(this.reqFrameId);
            this.reqFrameId = null;
        }
    }

    checkCollision(laser) {
        if (this.squares[laser.coords].classList.contains('invader')) {
            this.squares[laser.coords].classList.remove('laser');
            if (this.boss) { // each hit on boss lowers its opacity
                const boss = this.squares[this.alienInvaders[0]];
                const img = boss.querySelector('img');
                this.bossHp -= this.bossDamage;
                this.invaders.currentBossHp = this.bossHp;
                img.style.opacity = this.bossHp;
                if (this.bossHp < 0.0005) {
                    new Explosion(this.squares[this.alienInvaders[3]], this.boss);
                    this.updateBossScore();
                }
            } else {
                this.removeInvader(laser);
            }
            new Explosion(this.squares[laser.coords]);
            if (!this.boss) {
                this.addRemovedInvadersIndex(laser);
            }
            if (!this.boss) {
                this.updateScore();
            }
            this.clearLaser(laser);
        }
    }

    //Removes invader
    removeInvader(laser) {
        this.squares[laser.coords].classList.remove('invader');
        const invaderImage = this.squares[laser.coords].querySelector('img');
        this.squares[laser.coords].removeChild(invaderImage);
    }

    //Adds the removed invaders index to array
    addRemovedInvadersIndex(laser) {
        const alienRemoveIndex = this.alienInvaders.indexOf(laser.coords);
        this.aliensRemoved.push(alienRemoveIndex);
        const aliveNum = this.alienInvadersCopy[alienRemoveIndex];
        const aliveIndex = this.aliveInvaders.indexOf(aliveNum);
        this.aliveInvaders.splice(aliveIndex, 1);
    }

   //Updates score
    updateScore() {
        Laser.score += 100;
        this.scoreDisplay.textContent = Laser.score;
    }

    updateBossScore() {
        Laser.score += 2500;
        this.scoreDisplay.textContent = Laser.score;
    }

    //Iniziates the laser firing method
    fire() {
        this.soundManager.playLaserSound();
        this.currentFrameTime = performance.now();
        this.delta = this.currentFrameTime - this.lastFrameTime;
        if (this.delta >= 300) {
            this.lastFrameTime = this.currentFrameTime;
            this.lasers.push({ coords: this.shooter.currentShooterIndex });
            if (!Laser.isLaserActive) {
                Laser.isLaserActive = true;
                this.reqFrameId = requestAnimationFrame(() => this.animateLaser());
            }
        }
    }

    clearLaser(laser) {
        if (this.squares[laser.coords]) {
            this.squares[laser.coords].classList.remove('laser');
        }
        this.removeLaser(laser);
    }

    //Stop Laser
    stop() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId);
            this.reqFrameId = null;
        }
        Laser.isLaserActive = false;
    }

    //Resume Laser
    resume() {
        this.gameOnPause = false;
        if (Laser.isLaserActive && !this.reqFrameId) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser());
        }
    }

    //Pause Laser
    pause() {
        this.gameOnPause = true;
    }
}
