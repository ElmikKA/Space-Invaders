export class GameTimer {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.intervalId = null;
        this.elapsedTime = 0;
    }

    start() {
        if (this.intervalId) {
            // Timer is already running
            return;
        }
        if (this.startTime === null) {
            // Timer is starting for the first time
            this.startTime = Date.now();
        } else {
            // Timer is resuming from a paused state
            this.startTime = Date.now() - this.elapsedTime * 1000;  // Adjust start time based on elapsed time
        }
        this.intervalId = setInterval(() => this.updateTimer(), 1000);
    }
    
    stop() {
        this.endTime = Date.now();
        clearInterval(this.intervalId) 
    }

    updateTimer() {
        const currentTime = Date.now();
        const elapsedTimeMs = currentTime - this.startTime;
        this.elapsedTime = Math.floor(elapsedTimeMs / 1000);
        document.querySelector('.game-timer').innerHTML = this.elapsedTime;
    }

    pause() {
        if(!this.intervalId) {
            return;
        }

        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    reset() {
        this.startTime = null;
        this.elapsedTime = 0;
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.start();
    }

    resume() {
        this.start();
    }
}