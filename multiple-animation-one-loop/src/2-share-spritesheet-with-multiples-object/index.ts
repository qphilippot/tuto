import {getCanvas, getContext} from "./helper/canvas.helper";
import CoinAnimation from "./animation/coin.animation";

document.addEventListener('DOMContentLoaded', async () => {
    const canvas: HTMLCanvasElement = getCanvas('tuto-canvas');
    canvas.width = 800;
    canvas.height = 800;
    canvas.style.width = '800px';
    canvas.style.height = '800px';
    const fpsLabel = document.getElementById('fps');
    setInterval(() => {
        if (fpsLabel) {
            // @ts-ignore
            fpsLabel.innerText = `${Math.round((window.performance.memory.totalJSHeapSize / window.performance.memory.jsHeapSizeLimit) * 1000)}%`;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        // // coinAnimation.render(Date.now(), canvas, context);
        // coins.forEach(coin => coin.render(Date.now(), canvas, context))
    }, 300);

    const coins: CoinAnimation[] = [];

    for(let i = 0; i < 10; i++) {
        const coinAnimation = new CoinAnimation(Math.random() * 1000, Math.random() * 1000);
        coinAnimation.load();
        coins.push(coinAnimation);
    }

    const context = getContext<CanvasRenderingContext2D>(canvas, '2d');
    //
    // document.addEventListener('keydown', event => {
    //     if (event.key === 'ArrowUp') {
    //         context.clearRect(0, 0, canvas.width, canvas.height);
    //         coinAnimation.render(Date.now(), canvas, context);
    //     }
    // })
    // document.addEventListener('keydown', event => {
    //     if (event.key === 'ArrowUp') {
    //         context.clearRect(0, 0, canvas.width, canvas.height);
    //         coinAnimation.render(Date.now(), canvas, context);
    //     }
    // })


    // let nbFrameRendered = 0;
    


    //


});

