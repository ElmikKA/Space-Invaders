import { Explosion } from "./Explosion.js";

//Maybe
//If the FPS drops down to 59 or lower, then the problem is with the laser movmentspeed


export class Laser {
    static score = 0;
    static isLaserActive = false;
    static laserSpeed = 3; //Number of frames to skip before moving

    constructor(width, squares, aliensRemoved, shooter, boss, bossHp, bossDamage, invaders) {
        this.shooter = shooter
        this.currentLaserIndex = shooter.currentShooterIndex;
        this.width = width;
        this.squares = squares;
        this.alienInvaders = invaders.lasers.alienInvaders;
        this.aliensRemoved = aliensRemoved;
        this.reqFrameId = null;
        this.frameCount = 0;
        this.aliveInvaders = invaders.lasers.aliveInvaders
        this.alienInvadersCopy = invaders.lasers.alienInvadersCopy
        this.boss = boss
        this.bossHp = bossHp
        this.bossDamage = bossDamage
        this.invaders = invaders

        this.lasers = []

        this.currentFrameTime = performance.now()
        this.delta = 0
        this.lastFrameTime = performance.now()
    }


    removeLaser(laser) {
        let index = this.lasers.indexOf(laser)
        this.lasers.splice(index, 1)
    }

    moveLaser() {
        let lasersToRemove = [] // in case multiple lasers have to be removed at once
        for (let laser of this.lasers) { // moves lasers if they are in bounds
            if (laser.coords >= 15) {
                this.squares[laser.coords].classList.remove('laser')
                laser.coords -= this.width;
                this.squares[laser.coords].classList.add('laser')
                this.checkCollision(laser)
            } else {
                lasersToRemove.push(laser) // if out of bounds the laser goes into remove array
            }
        }
        for (let laser of lasersToRemove) { // removes lasers that need to be removed
            this.clearLaser(laser)
        }
        if (this.lasers.length > 0) { // if there are still lasers on screen it keeps going
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        } else { // if no more active lasers it stops the animation
            Laser.isLaserActive = false
        }
    }

    animateLaser() {
        //Increment the frame counter
        this.frameCount++;
        // Only move the laser every Laser.laserSpeed frames
        if (this.frameCount % Laser.laserSpeed === 0) {
            this.moveLaser();
        } else if (this.lasers.length > 0) { // if there are lasers on screen it recursively calls this function until it can move them again
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    //Checks if the Laser hits invader
    checkCollision(laser) {
        if (this.squares[laser.coords].classList.contains('invader')) {
            this.squares[laser.coords].classList.remove('laser')
            if (this.boss) { // each hit on boss lowers its opacity
                let boss = this.squares[this.alienInvaders[0]]
                let img = boss.querySelector('img')
                this.bossHp -= this.bossDamage
                this.invaders.currentBossHp = this.bossHp
                img.style.opacity = this.bossHp
                if (this.bossHp < 0.0005) {
                    new Explosion(this.squares[this.alienInvaders[3]], this.boss)
                    this.updateBossScore()
                }
            } else {
                this.removeInvader(laser)
            }
            new Explosion(this.squares[laser.coords])
            if (!this.boss) {
                this.addRemovedInvadersIndex(laser)
            }
            if (!this.boss) {
                this.updateScore()
            }
            this.clearLaser(laser)
        }
    }

    //Removes invader
    removeInvader(laser) {
        this.squares[laser.coords].classList.remove('invader');
        const invaderImage = this.squares[laser.coords].querySelector('img')
        this.squares[laser.coords].removeChild(invaderImage)
    }

    //Adds the removed invaders index to array
    addRemovedInvadersIndex(laser) {
        const alienRemoveIndex = this.alienInvaders.indexOf(laser.coords)
        this.aliensRemoved.push(alienRemoveIndex)
        const aliveNum = this.alienInvadersCopy[alienRemoveIndex]
        const aliveIndex = this.aliveInvaders.indexOf(aliveNum)
        this.aliveInvaders.splice(aliveIndex, 1)
    }

    //Updates score
    //Maybe move to another class?
    updateScore() {
        const scoreDisplay = document.querySelector('.score');
        Laser.score += 100;
        scoreDisplay.textContent = Laser.score;
    }
    // maybe should have put these 2 together
    updateBossScore() {
        const scoreDisplay = document.querySelector('.score');
        Laser.score += 2500;
        scoreDisplay.textContent = Laser.score;
    }
    //Iniziates the laser firing method
    fire() {
        let music = new Audio('../sounds/laser2.wav')
        music.volume = 0.7
        this.currentFrameTime = performance.now() // shooting is now based on the time since last shot
        this.delta = this.currentFrameTime - this.lastFrameTime
        if (this.delta >= 300) {
            this.lastFrameTime = this.currentFrameTime
            this.lasers.push({ coords: this.shooter.currentShooterIndex })
            music.play()
            if (!Laser.isLaserActive) {
                Laser.isLaserActive = true
                this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
            }
        }
    }

    //Cleares laser
    clearLaser(laser) {
        if (this.squares[laser.coords]) {
            this.squares[laser.coords].classList.remove('laser')
        }
        this.removeLaser(laser)
    }

    stop() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null
        }
        Laser.isLaserActive = false
    }
}