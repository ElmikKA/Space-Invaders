import { Laser } from "./Laser.js";

//TODO
//Make a connection between the Laser and Shooter class

export class Shooter {
    constructor(squares, currentShooterIndex, width, alienInvaders, invadersRemoved) {
        this.squares = squares;
        this.currentShooterIndex = currentShooterIndex;
        this.width = width;
        this.alienInvaders = alienInvaders;
        this.invadersRemoved = invadersRemoved;
        this.lastMoveTime = 0;
        this.score = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.initEvent();
        this.addShooter(); // This ensures that the shooter image is added at the start of the game
        this.animate()
        this.shootLaser();
    }

    //Moves the shooter
    moveShooter() {
        //The shooter was moving 2px at once, but needed to move 1px
        //So this function does the thing 
        const now = Date.now();
        if (now - this.lastMoveTime < 100) return;  // Minimum 100 ms between moves
        this.lastMoveTime = now;
        this.removeShooter()
        if(this.movingLeft && this.currentShooterIndex % this.width !== 0) {
            this.currentShooterIndex -= 1;
        }
        if(this.movingRight && this.currentShooterIndex % this.width < this.width -1) {
            this.currentShooterIndex += 1;
        }
        this.addShooter()
    }
    
    //Removing Shooter
    removeShooter() {
        //removes the shooter class
        this.squares[this.currentShooterIndex].classList.remove('shooter');
        //Removes the shooterImage
        const shooterImage = this.squares[this.currentShooterIndex].querySelector('img')
        if(shooterImage) {
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
        shooterImage.src = 'src/spaceship.png';
        shooterImage.alt = 'Shooter';
        shooterImage.style.height= '80px';
        shooterImage.style.width = '80px';
        return shooterImage;
    }

    //Connects to the Laser class, when space is been pushed the the shooter will shoot a laser
    shootLaser() {
        document.addEventListener('keydown', (e) => {
            if(e.key === ' ') {
                const laser = new Laser(this.currentShooterIndex, this.width, this.squares, this.alienInvaders, this.invadersRemoved)
                laser.fire()
            }
        })
    }

    //Checks if the right keys are pushed
    initEvent() {
        document.addEventListener('keydown', (e) => {
            this.checkKeys(e, true)
        });

        document.addEventListener('keyup', (e) => {
            this.checkKeys(e, false)
        });
    }

    checkKeys(e, bool) {
        if(e.key === 'ArrowLeft') {
            this.movingLeft = bool;
        } else if (e.key === 'ArrowRight') {
            this.movingRight = bool;
        }
    }

    //Requesting AnimationFrame
    animate() {
        this.moveShooter();
        requestAnimationFrame(() => this.animate())
    }
}
