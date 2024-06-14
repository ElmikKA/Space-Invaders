import { Explosion } from "./Explosion.js"
export class InvaderLaser {

    constructor(alienInvaders, squares, width, laserSpeed, frequency, game) {
        this.alienShooterIndex = null
        this.alienInvaders = alienInvaders
        this.squares = squares
        this.width = width
        this.frameCount = 0
        this.moveCount = 0
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
        this.lasersToRemove = []
    }

    fire() {
        // picks a random alive invader and shoots from his row
        const RandomAlien = Math.floor(Math.random() * this.aliveInvaders.length)
        let alienNum = this.aliveInvaders[RandomAlien]
        this.alienShooterIndex = this.alienInvadersCopy.indexOf(alienNum)
        this.alienCoords = this.alienInvaders[this.alienShooterIndex]
        this.lowestIndex()
        let music = new Audio('../sounds/invaderLaser2.wav')
        music.volume = 0.7
        music.play()
        this.lasers.push({ coords: this.alienCoords })
        if (!this.reqFrameId && !this.dead) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    animateLaser() {
        // different counts so the dynamic firerate based on invaders alive works
        this.frameCount++
        this.moveCount++

        // different firerate based on alive invaders with a cap of 10 frames
        if (this.frameCount % Math.floor(Math.max(10, (this.frequency - this.aliveInvaders.length * 2))) === 0) {
            this.fire()
            this.frameCount = 0
        }
        if (this.frameCount % this.laserSpeed === 0) {
            this.moveLaser()
        } else if (!this.dead) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    moveLaser() {
        this.lasersToRemove = [] // in case multiple lasers go out of bounds at once
        for (let i = 0; i < this.lasers.length; i++) {
            let laser = this.lasers[i]
            if (laser.coords < 210) {
                this.squares[laser.coords].classList.remove('laser')
                laser.coords += this.width
                this.squares[laser.coords].classList.add('laser')
                this.checkCollision(laser)
            } else {
                this.lasersToRemove.push(laser) // if out of bounds it adds laser to be removed
            }
        }
        for (let laser of this.lasersToRemove) { // removes all oob lasers
            this.removeLaser(laser)
        }
        if (!this.dead) { // if still alive it keeps going
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    checkCollision(laser) { // checks if laser hit shooter
        if (this.squares[laser.coords].classList.contains('shooter')) {
            this.removeLaser(laser)
            this.removeHp(laser)
        }
    }

    removeLaser(laser) { // removes laser
        let index = this.lasers.indexOf(laser)
        this.lasers.splice(index, 1)
        if (this.squares[laser.coords]) {
            this.squares[laser.coords].classList.remove('laser')
        }
    }

    removeHp(laser) {
        // removes hp if damaged
        let child = this.hp.lastElementChild
        this.hp.removeChild(child)
        if (this.hp.childElementCount === 0) { // adds explosion on death
            new Explosion(this.squares[laser.coords])
            this.dead = true
            cancelAnimationFrame(this.reqFrameId)
        }
    }


    lowestIndex() { // when the top row of aliens are chosen for laser it shoots from the lowest alien
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

    stop() { // stops everything
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null
        }
    }
}