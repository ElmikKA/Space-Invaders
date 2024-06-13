export class Explosion {
    constructor(element, boss) {
        this.element = element;
        this.reqFrameId = null;
        this.startTime = null;
        this.duration = 300; // Duration of the explosion in milliseconds
        this.boss = boss
        this.initiate();
    }

    initiate() {
        let music = new Audio('../sounds/explosion2.mp3')
        music.volume = 0.5
        music.play()
        this.startAnimation();
    }

    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;

        // Calculate progress (from 0 to 1)
        const progress = Math.min(elapsed / this.duration, 1);

        // Apply the animation effect based on progress
        if (progress < 1) {
            this.element.classList.add('boom');
            if (this.boss) {
                this.element.style.width = '300px'
                this.element.style.height = '300.33px'
            } else {
                this.element.style.width = '80px'
                this.element.style.height = '80.33px'
            }
            this.reqFrameId = requestAnimationFrame(this.animate.bind(this));
        } else {
            this.element.classList.remove('boom');
            this.cancelAnimation();
        }
    }

    startAnimation() {
        if (!this.reqFrameId) {
            this.reqFrameId = requestAnimationFrame(this.animate.bind(this));
        }
    }

    cancelAnimation() {
        if (this.reqFrameId) {
            cancelAnimationFrame(this.reqFrameId);
            this.reqFrameId = null;
        }
    }
}
