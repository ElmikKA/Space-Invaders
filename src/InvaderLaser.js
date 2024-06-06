import { Explosion } from "./Explosion.js"
export class InvaderLaser {
    static laserSpeed = 10

    constructor(alienShooterIndex, alienInvaders, currentShooterIndex, squares, width) {
        this.alienShooterIndex = alienShooterIndex
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
    }

    fire() {
        const alienCoords = this.alienInvaders[this.alienShooterIndex]
        this.currentLaserIndex = this.lowestIndex(alienCoords)
        this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
    }

    animateLaser() {
        this.frameCount++
        if (this.frameCount % InvaderLaser.laserSpeed === 0) {
            console.log('moving laser')
            this.moveLaser()
        } else {
            this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
        }
    }

    moveLaser() {
        if (this.currentLaserIndex < 210) {
            this.squares[this.currentLaserIndex].classList.remove('laser')
            this.currentLaserIndex += this.width
            this.squares[this.currentLaserIndex].classList.add('laser')
            if (this.checkCollision()) {
                cancelAnimationFrame(this.reqFrameId)
            } else {
                this.reqFrameId = requestAnimationFrame(() => this.animateLaser())
            }
        } else {
            cancelAnimationFrame(this.reqFrameId)
            this.removeLaser()
        }
    }

    checkCollision() {
        if (this.squares[this.currentLaserIndex].classList.contains('shooter')) {
            cancelAnimationFrame(this.reqFrameId)
            this.removeLaser()
            this.removeHp()
            return true
        }
        return false
    }

    removeLaser() {
        this.squares[this.currentLaserIndex].classList.remove('laser')
    }

    removeHp() {
        let child = this.hp.lastElementChild
        this.hp.removeChild(child)
        console.log(this.hp.childElementCount)
        if (this.hp.childElementCount === 0) {
            new Explosion(this.squares[this.currentLaserIndex])
            this.dead = true
            // alert('dead')
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
        lowestIndex += 15
        return lowestIndex
    }
}