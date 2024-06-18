export class LevelManager {
    constructor(width) {
        this.width = width;
    }

    getRegularInvaders() {
        return [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        ];
    }

    getBossInvaders() {
        return [
            0, 1, 2, 3, 4, 5, 6,
            15, 16, 17, 18, 19, 20, 21,
            30, 31, 32, 33, 34, 35, 36,
        ];
    }

    adjustDifficulty(level, invaderLaserSpeed, invaderFrequency, movementSpeed) {
        if (level > 2) {
            invaderLaserSpeed = Math.max(5, invaderLaserSpeed - 1);
            invaderFrequency = Math.max(10, invaderFrequency - 10);
            movementSpeed = Math.max(200, movementSpeed - 100);
        }
        return { invaderLaserSpeed, invaderFrequency, movementSpeed };
    }
}