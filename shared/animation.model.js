class Animation {
    constructor(settings = {}) {
        this.canvas = settings.canvas;
        this.context = this.canvas.getContext('2d');

        if (typeof settings.render === 'function') {
            this.render = settings.render;
        }

        else {
            throw `You must provide a render method`;
        }


        this.isPlaying = false;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    pause() {
        this.isPlaying = false;
    }

    play() {
        this.isPlaying = true;

        // invoke rendering loop
        this.renderingLoop();
    }

    askRendering() {
        this.render(this.context, this.canvas);
    }

    renderingLoop() {
        if (this.isPlaying === true) {
            window.requestAnimationFrame(this.renderingLoop.bind(this));
            this.render(this.context, this.canvas);
        }
    }
}

export default Animation;