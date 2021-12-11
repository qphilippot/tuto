import {getCanvas, getContext} from "./helper/canvas.helper";

document.addEventListener('DOMContentLoaded', () => {
    const canvas: HTMLCanvasElement = getCanvas('tuto-canvas');
    canvas.width = 100;
    canvas.height = 100;

    const context = getContext<CanvasRenderingContext2D>(canvas, '2d');


    context.fillStyle = 'blue';
    context.rect(0, 0, 50, 50);
    context.fill();

    // const fpsLabel = document.getElementById('fps');
    // let nbFrameRendered = 0;
});

