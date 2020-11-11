import Animation from '../../shared/animation.model';
import  ImageProcessing  from 'image-processing';


document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('tuto-video');

    /**
     * @param {Uint8Array} pixelBuffer 
     */
    function applyGrayscaleFilter(pixelBuffer) {
        for (let offset = 0; offset <pixelBuffer.length; offset += 4) {
            const grayscale = ImageProcessing.RGBToGrayscaleFilter.applyToPixel(pixelBuffer, offset);
            pixelBuffer[offset] = grayscale;
            pixelBuffer[offset + 1] = grayscale;
            pixelBuffer[offset + 2] = grayscale;
            pixelBuffer[offset + 3] = 255;
        }
    }

    const animation = new Animation({
        canvas: document.getElementById('tuto-canvas'),
        render: (context, canvas) => {
            const fakeCanvas = document.createElement('canvas');
            fakeCanvas.width =  canvas.width;
            fakeCanvas.height = canvas.height;

            const fakeContext = fakeCanvas.getContext('2d');
            fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height);

            const fakeImageData = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);
            const buffer =  fakeImageData.data;

            applyGrayscaleFilter(buffer);

            animation.clear();
            context.putImageData(fakeImageData, 0, 0);
        }
    });
    
    video.addEventListener('play', () => {
        animation.play();
    });
    
    video.addEventListener('pause', () => {
        animation.pause();
    });
    
    video.addEventListener('end', () => {
        animation.pause();
    });
    
    video.addEventListener('timeupdate', () => {
        animation.askRendering()
    })
});

