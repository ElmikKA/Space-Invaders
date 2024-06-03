


export class GameTimer {

    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.intervalId = null;
    }

    start() {
        this.startTime = Date.now();
        this.intervalId = setInterval(() => this.updateTimer(), 1000)
    }

    updateTimer() {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
        document.querySelector('.game-timer').innerHTML = elapsedTime;
    }



}