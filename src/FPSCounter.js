export class FPSCounter {
    constructor() {
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.reqFrameId = null;
    }

    updateFPS() {
        const currentFrameTime = performance.now();
        const delta = currentFrameTime - this.lastFrameTime;
        this.frameCount++;
    
        if (delta >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = currentFrameTime;
            document.getElementById('fps-counter').innerText = `FPS: ${this.fps}`;
        }
    
        this.reqFrameId = requestAnimationFrame(() => this.updateFPS());
    }
    
    start() {
        this.reqFrameId = requestAnimationFrame(() => this.updateFPS());
    }
    
    stop() {
        cancelAnimationFrame(this.reqFrameId);
    }
    
}