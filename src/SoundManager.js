
export class SoundManager {
    constructor() {
        this.backgroundMusic = document.querySelector('#audio');
        this.beepSound = new Audio('../sounds/beep2.mp3');
        this.beepSound2 = new Audio('../sounds/beep.mp3');
        this.explosion2 = new Audio('../sounds/explosion2.mp3')
        this.laser2 = new Audio('../sounds/laser2.wav')
        this.invaderLaser2 = new Audio('../sounds/invaderLaser2.wav');
        this.backgroundMusic.volume = 0.4;
        this.beepSound.volume = 0.5;
        this.beepSound2.volume = 0.5;
        this.laser2.volume = 0.7;
        this.explosion2.volume = 0.5;
        this.invaderLaser2.volume = 0.7;
    }

    playBackgroundMusic() {
        this.backgroundMusic.play();
    }

    playBeepSound() {
        this.beepSound.play();
    }

    playBeepSound2() {
        this.beepSound2.play();
    }

    playExplosionSound() {
        this.explosion2.play();
    }

    playLaserSound() {
        this.laser2.play();
    }

    playInvaderLaserSound() {
        this.invaderLaser2.play();
    }
}
