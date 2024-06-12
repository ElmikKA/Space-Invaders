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
    }

    moveLaser() {
        this.squares[this.currentLaserIndex].classList.remove('laser')
        this.currentLaserIndex -= this.width;
        if (this.currentLaserIndex >= 0) {
            this.squares[this.currentLaserIndex].classList.add('laser')
            this.checkCollision()
            if (Laser.isLaserActive) {
                this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
            }
        } else {
            this.clearLaser()
            return;
        }
    }

    animateLaser() {
        //Increment the frame counter
        this.frameCount++;
        // Only move the laser every Laser.laserSpeed frames
        if (this.frameCount % Laser.laserSpeed === 0) {
            this.moveLaser();
        } else {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    //Checks if the Laser hits invader
    checkCollision() {
        if (this.squares[this.currentLaserIndex].classList.contains('invader')) {
            this.squares[this.currentLaserIndex].classList.remove('laser')
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
                this.removeInvader()
            }
            new Explosion(this.squares[this.currentLaserIndex])
            if (!this.boss) {
                this.addRemovedInvadersIndex()
            }
            if (!this.boss) {
                this.updateScore()
            }
            this.clearLaser()
        }
    }

    //Removes invader
    removeInvader() {
        this.squares[this.currentLaserIndex].classList.remove('invader');
        const invaderImage = this.squares[this.currentLaserIndex].querySelector('img')
        this.squares[this.currentLaserIndex].removeChild(invaderImage)
    }

    //Adds the removed invaders index to array
    addRemovedInvadersIndex() {
        const alienRemoveIndex = this.alienInvaders.indexOf(this.currentLaserIndex)
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
        this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
    }
    updateBossScore() {
        const scoreDisplay = document.querySelector('.score');
        Laser.score += 2500;
        scoreDisplay.textContent = Laser.score;
    }
    //Iniziates the laser firing method
    fire() {
        if (Laser.isLaserActive) return; // Do not fire if a laser is already active
        Laser.isLaserActive = true; // Set the flag to true when a laser is fired
        this.currentLaserIndex = this.shooter.currentShooterIndex;

        this.frameCount = 0;// Reset the frame count
        this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
    }

    //Cleares laser
    clearLaser() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null;
        }
        Laser.isLaserActive = false;
    }

    stop() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null
        }
        Laser.isLaserActive = false
    }
}