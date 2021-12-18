import {getCanvas, getContext} from "./helper/canvas.helper";
import CoinAnimation from "./animation/coin.animation";

document.addEventListener('DOMContentLoaded', async () => {
    const canvas: HTMLCanvasElement = getCanvas('tuto-canvas');
    canvas.width = 800;
    canvas.height = 800;
    canvas.style.width = '800px';
    canvas.style.height = '800px';


    const context = getContext<CanvasRenderingContext2D>(canvas, '2d');
    const coinAnimation = new CoinAnimation();
    await coinAnimation.load();

    // document.addEventListener('keydown', event => {
    //     if (event.key === 'ArrowUp') {
    //         context.clearRect(0, 0, canvas.width, canvas.height);
    //         coinAnimation.render(Date.now(), canvas, context);
    //     }
    // })

    const fpsLabel = document.getElementById('fps');
    let nbFrameRendered = 0;
    
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        coinAnimation.render(Date.now(), canvas, context);
    }, 100);

    //


});

