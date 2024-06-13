

export class GameUI {
    constructor() {
        this.startScreen = document.querySelector('.start-screen');
        this.loader = document.getElementById('loader');
        this.gameContent = document.querySelector('.game-content');
        this.resultScreen = document.querySelector('.result-screen');
        this.nextLevelDiv = document.querySelector('#next-level-div');
        this.restartButton = document.querySelector('#restart');
    }

    //Show start screen
    showStartScreen() {
        this.hideAllScreens()
        this.startScreen.classList.add('visible');
        this.startScreen.classList.remove('hidden');
    }

    //Show Game Content
    showGameContent() {
        this.hideAllScreens()
        this.gameContent.classList.remove('hidden');
    }

    //Show Loader
    showLoader() {
        this.hideAllScreens();
        this.loader.classList.remove('hidden');
        this.loader.classList.add('visible')
    }

    //Show Result Screen
    showResultScreen(win) {
        this.hideAllScreens()
        this.resultScreen.classList.remove('hidden');
        this.resultScreen.classList.add('visible')

        if(win) {
            this.nextLevelDiv.classList.remove('hidden')
            this.restartButton.classList.add('hidden')
        } else {
            this.nextLevelDiv.classList.add('hidden')
            this.restartButton.classList.remove('hidden');
        }
    }

    //Hide all the screens
    hideAllScreens() {
        this.startScreen.classList.add('hidden');
        this.startScreen.classList.remove('visible');
        this.loader.classList.add('hidden');
        this.loader.classList.remove('visible');
        this.gameContent.classList.add('hidden');
        this.resultScreen.classList.add('hidden');
        this.resultScreen.classList.remove('visible');
    }
}