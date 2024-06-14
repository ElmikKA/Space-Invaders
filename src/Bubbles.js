

export class Bubbles {
    constructor(containerId, maxBubbles = 150) {
        this.bubblesContainer = document.getElementById(containerId);
        this.maxBubbles = maxBubbles;
        this.bubblesCount = 0;
        this.animationFrameId = null;
    }

    createBubble() {
        if (this.bubblesCount >= this.maxBubbles) return; // Limit the number of bubbles

        const bubble = document.createElement('span');
        const duration = Math.random() * 20 + 10; // Random duration between 10 and 30 seconds
        const delay = Math.random() * 5; // Random delay up to 5 seconds

        bubble.style.setProperty('--i', duration);
        bubble.style.left = `${Math.random() * 100}vw`; // Position the bubble randomly along the width
        bubble.style.animationDelay = `${delay}s`; // Add random delay for each bubble

        this.bubblesContainer.appendChild(bubble);
        this.bubblesCount++;

        // Remove the bubble after the animation to avoid overflow
        setTimeout(() => {
            this.bubblesContainer.removeChild(bubble);
            this.bubblesCount--;
        }, (duration + delay) * 1000);
    }

    // Create bubbles at random intervals using requestAnimationFrame
    createBubblesContinuously() {
        this.createBubble();
        this.animationFrameId = requestAnimationFrame(() => this.createBubblesContinuously());
    }

    // Start creating bubbles
    start() {
        this.createBubblesContinuously();
    }

    // Stop creating bubbles
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}