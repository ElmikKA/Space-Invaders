

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

// const grid = document.querySelector('.game-board')
// const playButton = document.getElementById('play-button')
// const startScreen = document.querySelector('.start-screen')
// const loader = document.getElementById('loader')
// const gameContent = document.querySelector('.game-content')
// const gameContainer = document.querySelector('.game-container')
// const restartButton = document.getElementById('restart-button')
// let currentShooterIndex = 202
// let width = 15
// let aliensRemoved = []
// let lastFrameTime = performance.now();
// let frameCount = 0;
// let fps = 0;

// playButton.addEventListener('click', startGame)
// restartButton.addEventListener('click', startGame)

// function startGame() {
//     startScreen.style.display = 'none';
//     gameContainer.style.display = 'flex';
//     loader.style.display = 'flex';
//     let countdown = 3;

//     const countdownInterval = setInterval(() => {
//         loader.textContent = countdown;
//         countdown--;

//         if(countdown < 0) {
//             clearInterval(countdownInterval);
//             gameContent.style.display = 'block';
//             loader.style.visibility = 'hidden';
//             gameContent.style.visibility = 'visible'
//             initializeGame();
//         }
//     }, 1000)
// }

// //If the FPS drops down 60 then there is a performace issue
// function updatedFPS() {
//     //This provides a high-resolution timestamp
//     const currentFrameTime = performance.now()
//     //Calculates the time difference (Delta) between the current frame and the last frame
//     const delta = currentFrameTime - lastFrameTime;
//     frameCount++
//     //If a second has passed, updates the FPS counter, resets the frame count, and updates the last frame time
//     if(delta >= 1000) {
//         fps = frameCount;
//         frameCount = 0;
//         lastFrameTime = currentFrameTime;
//     }

//     document.getElementById('fps-counter').innerText = `FPS: ${fps}`
//     requestAnimationFrame(updatedFPS)
// }

// requestAnimationFrame(updatedFPS)

// function initializeGame() {
//     //This is where i make all the 20 x 20px boxes 
//     for (let i = 0; i < width * width; i++) {
//         const square = document.createElement('div')
//         grid.appendChild(square)
//     }

//     const squares = Array.from(document.querySelectorAll('.game-board div'))

//     const alienInvaders = [
//         0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
//         15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
//         30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
//     ]

//     //INVADERS
//     const invaders = new Invaders(squares, alienInvaders, aliensRemoved, width, currentShooterIndex, gameContainer)
//     const shooter = new Shooter(squares, currentShooterIndex, width, alienInvaders, aliensRemoved);
//     invaders.move()
//     shooter.initEvent()
// }









