import { Game } from "./src/Game.js";
import { Bubbles } from "./src/Bubbles.js";

document.addEventListener('DOMContentLoaded', () => {
    const bubblesCreator = new Bubbles('bubbles');
    bubblesCreator.start();
    const game = new Game();
    game.start()
})
