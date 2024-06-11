import { InvaderLaser } from "./InvaderLaser.js";
export class Invaders {
    constructor(squares, alienInvaders, invaderRemoved, width, currentShooterIndex, gameContainer, result, resultScreen, laserSpeed, frequency, movementSpeed, game, bossHp) {
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
        this.reqFrameId = null;
        this.shooting = false
        this.game = game
        this.boss = game.boss
        this.currentBossHp = bossHp

        // stats
        this.moveInterval = movementSpeed;
        this.laserSpeed = laserSpeed
        this.frequency = frequency

        this.lasers = new InvaderLaser(this.alienInvaders, this.squares, this.width, this.laserSpeed, this.frequency, game)
    }

    // Adds invaders to the grid
    //Optimized
    addInvaders() {
        const fragment = document.createDocumentFragment();
        this.alienInvaders.forEach((invader, index) => {
            if (!this.invaderRemoved.includes(index)) {
                const square = this.squares[invader];
                square.classList.add('invader');
                if (this.boss) {// if on boss level only add 1 image
                    if (!square.querySelector('img') && index === 0) {
                        const invaderImage = this.createInvaderImage();
                        fragment.appendChild(invaderImage);
                    }
                } else {
                    if (!square.querySelector('img')) {
                        const invaderImage = this.createInvaderImage();
                        fragment.appendChild(invaderImage);
                    }
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
        if (this.boss) {
            invaderImage.style.opacity = this.currentBossHp
            invaderImage.style.width = '550px';
            invaderImage.style.height = '250.33px';
        } else {
            invaderImage.style.width = '80px';
            invaderImage.style.height = '53.33px';
        }
        return invaderImage
    }

    //Moves invaders in the grid
    moveInvaders() {
        // console.log('move invaders', this.boss)
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
        if (!this.shooting) {
            this.shootLaser()
        }
        if (this.reqFrameId) {
            this.reqFrameId = requestAnimationFrame(() => this.moveInvaders())
        }
    }

    //Remove invaders
    removeInvaders() {
        this.alienInvaders.forEach((invader) => {
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
        this.reqFrameId = requestAnimationFrame(() => this.moveInvaders())
    }

    //Check game conditions like win or game over
    checkGameCondition() {
        this.currentShooterIndex = this.game.shooter.currentShooterIndex // if we don't update it from the shooter class it stays 202
        if (this.currentBossHp <= 0.00009) {
            this.gameContainer.style.display = 'none';
            this.resultScreen.style.display = 'flex';
            this.resultScreen.querySelector('#restart').style.display = 'none'
            this.resultScreen.querySelector('#next-level').style.display = 'flex'
            this.result.textContent = 'YOU HAVE WON'
            this.game.level += 1
            console.log(this.game.level)
            this.stop()
        }
        if (this.invaderRemoved.length === this.alienInvaders.length) {
            this.gameContainer.style.display = 'none';
            this.resultScreen.style.display = 'flex';
            this.resultScreen.querySelector('#restart').style.display = 'none'
            this.resultScreen.querySelector('#next-level').style.display = 'flex'
            this.result.textContent = 'YOU HAVE WON'
            this.game.level += 1
            console.log(this.game.level)
            this.stop()
        }

        if (this.squares[this.currentShooterIndex].classList.contains('invader')) {
            this.gameContainer.style.display = 'none';
            this.resultScreen.style.display = 'flex';
            this.resultScreen.querySelector('#restart').style.display = 'flex'
            this.resultScreen.querySelector('#next-level').style.display = 'none'
            this.result.textContent = 'GAME OVER'
            this.lasers.dead = true
            this.stop()
        }

        if (this.lasers.dead) {
            this.gameContainer.style.display = 'none';
            this.resultScreen.style.display = 'flex';
            this.resultScreen.querySelector('#restart').style.display = 'flex'
            this.resultScreen.querySelector('#next-level').style.display = 'none'
            this.result.textContent = 'GAME OVER'
            this.stop()
        }
    }

    // Stop the movment of invaders
    stop() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null
            this.lasers.stop()
        }
    }

    shootLaser() {
        this.lasers.fire()
        this.shooting = true
    }
}