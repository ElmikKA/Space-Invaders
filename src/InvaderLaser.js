import { Explosion } from "./Explosion.js"
export class InvaderLaser {

    constructor(alienInvaders, currentShooterIndex, squares, width, aliveInvaders, alienInvadersCopy, laserSpeed, frequency) {
        this.alienShooterIndex = null
        this.alienInvaders = alienInvaders
        this.currentShooterIndex = currentShooterIndex
        this.squares = squares
        this.width = width
        this.doubleEdge = false
        this.frameCount = 0
        this.reqFrameId = null
        this.currentLaserIndex = 0
        this.hp = document.querySelector('.hearts')
        this.dead = false
        this.aliveInvaders = aliveInvaders
        this.alienInvadersCopy = alienInvadersCopy
        this.lasers = []
        this.laserInfo = { coords: 0 }
        this.laserSpeed = laserSpeed
        this.frequency = frequency
    }


    fire() {
        const alienShooterIndex = Math.floor(Math.random() * this.aliveInvaders.length)
        let alienNum = this.aliveInvaders[alienShooterIndex]
        this.alienShooterIndex = this.alienInvadersCopy.indexOf(alienNum)
        const alienCoords = this.alienInvaders[this.alienShooterIndex]
        this.currentLaserIndex = this.lowestIndex(alienCoords)
        this.lasers.push({ coords: this.currentLaserIndex })
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
        let removeLaser = null
        for (let i = 0; i < this.lasers.length; i++) {
            let laser = this.lasers[i]
            if (laser.coords < 210) {
                this.squares[laser.coords].classList.remove('laser')
                laser.coords += this.width
                this.squares[laser.coords].classList.add('laser')
                this.checkCollision(laser)
            } else {
                removeLaser = laser
            }
        }
        if (removeLaser) {
            this.removeLaser(removeLaser)
        }
        if (!this.dead) {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    checkCollision(laser) {
        if (this.squares[laser.coords].classList.contains('shooter')) {
            this.removeLaser(laser)
            this.removeHp(laser)
            return true
        }
        return false
    }

    removeLaser(laser) {
        this.squares[laser.coords].classList.remove('laser')
        this.lasers.shift()
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

    lowestIndex(alienCoords) {
        let lowestIndex = alienCoords
        for (let i = 1; i < 4; i++) {
            if (alienCoords + (i * 15) >= 225) {
                break
            } else {
                if (this.squares[alienCoords + (i * 15)].classList[0] === 'invader') {
                    lowestIndex = alienCoords + (i * 15)
                }
            }
        }
        return lowestIndex
    }
}