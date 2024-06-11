

import { Game } from "./src/Game.js";

document.addEventListener('DOMContentLoaded', () => {
    const bubblesContainer = document.getElementById('bubbles')
    const maxBubbles = 202;
    let bubblesCount = 0;

    function createBubble() {
        if (bubblesCount >= maxBubbles) return; // Limit the number of bubbles

        const bubble = document.createElement('span');
        const duration = Math.random() * 20 + 10; // Random duration between 10 and 30
        const delay = Math.random() * 5; // Random delay up to 5 seconds

        bubble.style.setProperty('--i', duration);
        bubble.style.left = `${Math.random() * 100}vw`; // Position the bubble randomly along the width
        bubble.style.animationDelay = `${delay}s`; // Add random delay for each bubble

        bubblesContainer.appendChild(bubble);
        bubblesCount++;

        // Remove the bubble after the animation to avoid overflow
        setTimeout(() => {
            bubblesContainer.removeChild(bubble);
            bubblesCount--;
        }, (duration + delay) * 1000);
    }

    // Create bubbles at random intervals
    function createBubblesContinuously() {
        createBubble();
        setTimeout(createBubblesContinuously, 200); // Create a new bubble every 300ms
    }

    createBubblesContinuously();
    const game = new Game();
    game.start()
})
