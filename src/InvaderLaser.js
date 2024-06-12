import { Explosion } from "./Explosion.js"
export class InvaderLaser {

    constructor(alienInvaders, squares, width, laserSpeed, frequency, game) {
        this.alienShooterIndex = null
        this.alienInvaders = alienInvaders
        this.squares = squares
        this.width = width
        this.frameCount = 0
        this.reqFrameId = null
        this.hp = document.querySelector('.hearts')
        this.dead = false
        this.aliveInvaders = [...alienInvaders]
        this.alienInvadersCopy = [...alienInvaders]
        this.alienCoords = null
        this.lasers = []
        this.laserSpeed = laserSpeed
        this.frequency = frequency
        this.game = game
    }



    // fire rate does not change with the change of invaders (maybe change the logic?)
    fire() {
        const RandomAlien = Math.floor(Math.random() * this.aliveInvaders.length)
        let alienNum = this.aliveInvaders[RandomAlien]
        this.alienShooterIndex = this.alienInvadersCopy.indexOf(alienNum)
        this.alienCoords = this.alienInvaders[this.alienShooterIndex]
        this.lowestIndex()
        this.lasers.push({ coords: this.alienCoords })
        if (!this.reqFrameId && !this.dead) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    animateLaser() {
        this.frameCount++
        if (this.frameCount % this.frequency === 0) {
            this.fire()
        }
        if (this.frameCount % this.laserSpeed === 0) {
            this.moveLaser()
        } else if (!this.dead) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    moveLaser() {
        let lasersToRemove = [] // in case multiple lasers go out of bounds at once
        for (let i = 0; i < this.lasers.length; i++) {
            let laser = this.lasers[i]
            if (laser.coords < 210) {
                this.squares[laser.coords].classList.remove('laser')
                laser.coords += this.width
                this.squares[laser.coords].classList.add('laser')
                this.checkCollision(laser)
            } else {
                lasersToRemove.push(laser)
            }
        }
        for (let laser of lasersToRemove) {
            this.removeLaser(laser)
        }
        if (!this.dead) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    checkCollision(laser) {
        if (this.squares[laser.coords].classList.contains('shooter')) {
            this.removeLaser(laser)
            this.removeHp(laser)
        }
    }

    removeLaser(laser) {
        if (this.squares[laser.coords]) {
            this.squares[laser.coords].classList.remove('laser')
        }
        const index = this.lasers.indexOf(laser)
        if (index > -1) {
            this.lasers.splice(index, 1)
        }
    }

    removeHp(laser) {
        let child = this.hp.lastElementChild
        this.hp.removeChild(child)
        if (this.hp.childElementCount === 0) {
            new Explosion(this.squares[laser.coords])
            this.dead = true
            cancelAnimationFrame(this.reqFrameId)
        }
    }

    // breaks if we have more than 3 rows of opponents
    lowestIndex() {
        if (this.squares[this.alienCoords]) {
            for (let i = 1; i < 4; i++) {
                if (this.alienCoords + (i * 15) <= 225) {
                    if (this.squares[this.alienCoords + (i * 15)].classList[0] === 'invader') {
                        this.alienCoords += (i * 15)
                    }
                }
            }
        }
    }

    stop() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null
        }
    }
}