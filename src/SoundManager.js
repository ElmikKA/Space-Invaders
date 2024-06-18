
export class SoundManager {
    constructor() {
        this.backgroundMusic = document.querySelector('#audio');
        this.beepSound = new Audio('../assets/sounds/beep2.mp3');
        this.beepSound2 = new Audio('../assets/sounds/beep.mp3');
        this.explosion2 = new Audio('../assets/sounds/explosion2.mp3')
        this.laser2 = new Audio('../assets/sounds/laser2.wav')
        this.invaderLaser2 = new Audio('../assets/sounds/invaderLaser2.wav');
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
        this.cloneAndPlay(this.beepSound)
    }

    playBeepSound2() {
        this.cloneAndPlay(this.beepSound2)
    }

    playExplosionSound() {
        this.cloneAndPlay(this.explosion2)
    }

    playLaserSound() {
        this.cloneAndPlay(this.laser2)
    }

    playInvaderLaserSound() {
        this.cloneAndPlay(this.invaderLaser2)
    }

    cloneAndPlay(audio) {
        const clonedAudio = audio.cloneNode(true)
        clonedAudio.volume = audio.volume
        clonedAudio.play()
    }
}
