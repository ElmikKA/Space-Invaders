import { InvaderLaser } from "./InvaderLaser.js";
export class Invaders {
    constructor(squares, alienInvaders, invaderRemoved, width, currentShooterIndex, gameContainer, result, resultScreen, aliveInvaders, alienInvadersCopy) {
        this.squares = squares;
        this.alienInvaders = alienInvaders;
        this.invaderRemoved = invaderRemoved;
        this.width = width
        this.currentShooterIndex = currentShooterIndex;
        this.gameContainer = gameContainer;
        this.result = result;
        this.resultScreen = resultScreen;
        this.direction = 1;
        this.goingRight = true;
        this.lastMoveTime = 0;
        this.moveInterval = 100;
        this.reqFrameId = null;
        this.aliveInvaders = aliveInvaders
        this.alienInvadersCopy = alienInvadersCopy
    }

    // Adds invaders to the grid
    //Optimized
    addInvaders() {
        const fragment = document.createDocumentFragment();
        this.alienInvaders.forEach((invader, index) => {
            if (!this.invaderRemoved.includes(index)) {
                const square = this.squares[invader];
                square.classList.add('invader');
                if (!square.querySelector('img')) {
                    const invaderImage = this.createInvaderImage();
                    fragment.appendChild(invaderImage);
                }
                square.appendChild(fragment);
            }
        });
    }

    // Creates the Invaders Image
    createInvaderImage() {
        const invaderImage = document.createElement('img');
        invaderImage.src = 'assets/images/invader.gif';
        invaderImage.alt = 'Invader';
        invaderImage.style.width = '80px';
        invaderImage.style.height = '53.33px';
        return invaderImage
    }

    //Moves invaders in the grid
    moveInvaders() {
        const now = Date.now()
        if (now - this.lastMoveTime < this.moveInterval) {
            this.reqFrameId = requestAnimationFrame(() => this.moveInvaders())
            return;
        }
        this.lastMoveTime = now;
        this.removeInvaders()
        this.updateDirection()
        this.updatePositsion()
        this.addInvaders()
        this.checkGameCondition()
        this.shootLaser()
        this.reqFrameId = requestAnimationFrame(() => this.moveInvaders())
    }

    //Remove invaders
    removeInvaders() {
        this.alienInvaders.forEach((invader, index) => {
            const square = this.squares[invader];
            square.classList.remove('invader');

            const invaderImage = square.querySelector('img');
            if (invaderImage) {
                square.removeChild(invaderImage);
            }
        });
    }

    //Updates the direction of invaders based on edge detection
    updateDirection() {
        const leftEdge = this.alienInvaders[0] % this.width === 0;
        const rightEdge = this.alienInvaders[this.alienInvaders.length - 1] % this.width === this.width - 1;

        if (rightEdge && this.goingRight) {
            this.switchDirection(this.width + 1, -1, false);
        }

        if (leftEdge && !this.goingRight) {
            this.switchDirection(this.width - 1, 1, true);
        }
    }

    //Switches the direction of invaders
    switchDirection(offset, newDirection, goingRight) {
        for (let i = 0; i < this.alienInvaders.length; i++) {
            this.alienInvaders[i] += offset;
        }
        this.direction = newDirection;
        this.goingRight = goingRight
    }

    // Update the positsion of invaders
    updatePositsion() {
        for (let i = 0; i < this.alienInvaders.length; i++) {
            this.alienInvaders[i] += this.direction;
        }
    }

    //Starts the movment of invaders
    move() {
        // this.shootLaser()
        this.reqFrameId = requestAnimationFrame(() => this.moveInvaders())
        // const invaderLaser = new InvaderLaser(this.alienInvaders, this.invaderRemoved, this.squares, this.aliveInvaders)
        // invaderLaser.fire(1000)
    }

    //Check game conditions like win or game over
    checkGameCondition() {
        if (this.invaderRemoved.length === this.alienInvaders.length) {
            this.gameContainer.style.display = 'none';
            this.resultScreen.style.display = 'flex';
            this.result.textContent = 'YOU HAVE WON'
            this.stop()
        }

        if (this.squares[this.currentShooterIndex].classList.contains('invader')) {
            this.resultScreen.style.display = 'flex';
            this.result.textContent = 'GAME OVER'
            this.stop()
        }
    }
    // Stop the movment of invaders
    stop() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null
        }
    }
    //picks a random alive invader and shoots a laser
    shootLaser() {
        const alienShooterIndex = Math.floor(Math.random() * this.aliveInvaders.length)
        let alienNum = this.aliveInvaders[alienShooterIndex]
        let alienIndex = this.alienInvadersCopy.indexOf(alienNum)
        const iLazer = new InvaderLaser(alienIndex, this.alienInvaders, this.currentShooterIndex, this.squares, this.width)
        iLazer.fire()
    }
}