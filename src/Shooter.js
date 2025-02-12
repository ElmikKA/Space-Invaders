import { Laser } from "./Laser.js";

export class Shooter {
    constructor(squares, currentShooterIndex, width, invadersRemoved, game, bossHp, bossDamage) {
        this.squares = squares;
        this.currentShooterIndex = currentShooterIndex;
        this.width = width;
        this.lastMoveTime = 0;
        this.score = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.boss = game.boss
        this.currentBossHp = 1
        this.bossHp = bossHp
        this.bossDamage = bossDamage
        this.game = game
        this.gameOnPause = false;

        this.addShooter(); // This ensures that the shooter image is added at the start of the game
        this.animate()
        this.shootLaser();
        this.shootingInterval = null

        this.reqFrameId = null


        this.boundCheckKeysDown = (e) => this.checkKeys(e, true)
        this.boundCheckKeysUp = (e) => this.checkKeys(e, false)

        this.initEvent();
        this.laser = new Laser(this.width, this.squares, invadersRemoved, this, this.boss, this.bossHp, this.bossDamage, game.invaders)

    }

    //Moves the shooter
    moveShooter() {
        //The shooter was moving 2px at once, but needed to move 1px
        //So this function does the thing 
        const now = Date.now();
        if (now - this.lastMoveTime < 100) return;  // Minimum 100 ms between moves
        this.lastMoveTime = now;
        this.removeShooter();
        this.updatedShooterPositsion();
        this.addShooter();
    }

    updatedShooterPositsion() {
        if (this.movingLeft && this.currentShooterIndex % this.width !== 0) {
            this.currentShooterIndex -= 1;
        }
        if (this.movingRight && this.currentShooterIndex % this.width < this.width - 1) {
            this.currentShooterIndex += 1;
        }
    }

    //Removing Shooter
    removeShooter() {
        //removes the shooter class
        this.squares[this.currentShooterIndex].classList.remove('shooter');
        //Removes the shooterImage
        const shooterImage = this.squares[this.currentShooterIndex].querySelector('img')
        if (shooterImage) {
            this.squares[this.currentShooterIndex].removeChild(shooterImage)
        }
    }

    //Adding shooter class
    addShooter() {
        this.squares[this.currentShooterIndex].classList.add('shooter')
        const shooterImage = this.shooterImage()
        this.squares[this.currentShooterIndex].appendChild(shooterImage)
    }

    //Adding shooter image
    shooterImage() {
        const shooterImage = document.createElement('img')
        shooterImage.src = 'assets/images/spaceship.png';
        shooterImage.alt = 'Shooter';
        shooterImage.style.height = '80px';
        shooterImage.style.width = '80px';
        return shooterImage;
    }

    //Connects to the Laser class, when space is been pushed the the shooter will shoot a laser
    shootLaser() {
        let isShooting = false
        const startShooting = () => {
            if (!this.shootingInterval && !isShooting) {
                this.laser.fire()
                isShooting = true
                this.shootingInterval = setInterval(() => {
                    this.laser.fire()
                }, 50);
            }
        }

        const stopShooting = () => {
            clearInterval(this.shootingInterval)
            this.shootingInterval = null
            isShooting = false
        }

        const keyShoot = (e) => {
            if (e.key === ' ') {
                if (e.type === 'keydown') {
                    startShooting()
                } else if (e.type === 'keyup') {
                    stopShooting()
                }
            }
        }
        document.addEventListener('keydown', keyShoot)
        document.addEventListener('keyup', keyShoot)
        this.keyShoot = keyShoot
    }

    //Checks if the right keys are pushed
    initEvent() {
        document.addEventListener('keydown', this.boundCheckKeysDown);
        document.addEventListener('keyup', this.boundCheckKeysUp);
    }

    checkKeys(e, bool) {
        switch (e.key) {
            case 'ArrowLeft':
                this.movingLeft = bool;
                break;
            case 'ArrowRight':
                this.movingRight = bool;
                break;
        }
    }

    //Requesting AnimationFrame
    animate() {
        if (!this.gameOnPause) {
            this.moveShooter();
            this.reqFrameId = requestAnimationFrame(() => this.animate())
        }
    }

    stop() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId)
            this.reqFrameId = null
        }
        clearInterval(this.shootingInterval)
        this.shootingInterval = null;
        document.removeEventListener('keydown', this.keyShoot)
        document.removeEventListener('keydown', this.boundCheckKeysDown)
        document.removeEventListener('keydown', this.boundCheckKeysUp)
        this.laser.stop()
    }

    //Resumes the Shooters movement
    resume() {
        this.gameOnPause = false;
        this.initEvent()
        this.animate()
        this.laser.resume()
    }

    // Pauses the Shooters movement
    pause() {
        this.gameOnPause = true;
        this.laser.pause()
    }
}
