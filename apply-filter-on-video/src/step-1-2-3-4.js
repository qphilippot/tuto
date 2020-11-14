import Animation from '../../shared/animation.model';
import  ImageProcessing  from 'image-processing';
import PointerCoordsHelper from '../../shared/pointer-coords.helper';
import CollisionHelper from '../../shared/collision.helper';
import GeometryHelper from '../../shared/geometry.helper';


document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('tuto-video');
    const pointerCoords = { x: 0, y: 0};

    document.addEventListener('pointermove', event => {
        pointerCoords.x = event.clientX;
        pointerCoords.y = event.clientY;
    });

    /**
     * step 1 - Apply filter to the whole buffer
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

            const coordsRelativeToCanvas = PointerCoordsHelper.getCoordsRelativeToElement(
                canvas,
                pointerCoords.x,
                pointerCoords.y
            );

           
            const fakeContext = fakeCanvas.getContext('2d');
            fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height);

            const fakeImageData = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);
            const buffer =  fakeImageData.data;

            // step 2 - apply filter only if pointer is not over canvas 
            // const isPointerHoverCanvas = (
            //     coordsRelativeToCanvas.x >= 0 &&
            //     coordsRelativeToCanvas.y >= 0 &&
            //     coordsRelativeToCanvas.x < canvas.width &&
            //     coordsRelativeToCanvas.y < canvas.height 
            // );

            
            // if (isPointerHoverCanvas === false) {
            //     applyGrayscaleFilter(buffer) ;
            // }


            // step 3 - apply to the whole buffer, execept a circle defined by pointer position
            for (let offset = 0; offset < buffer.length; offset += 4) {
                const pixelOffset = (offset / 4); // pixels have 4 channel in ImageData
                const pixelX = pixelOffset % canvas.width;
                const pixelY = pixelOffset / canvas.width;
              
                const radius = 80;

                const isInCircle = CollisionHelper.isPointInCircle(
                    pixelX, pixelY,
                    coordsRelativeToCanvas.x, coordsRelativeToCanvas.y,
                    radius
                );

                

                if (isInCircle === false) {
                    const grayscale = ImageProcessing.RGBToGrayscaleFilter.applyToPixel(buffer, offset);
                    // (step 3)
                    buffer[offset] = grayscale;
                    buffer[offset + 1] = grayscale;
                    buffer[offset + 2] = grayscale;
                    buffer[offset + 3] = 255;
                }

                else {
                    // step 4 - apply a weigth to color
                    const grayscale = ImageProcessing.RGBToGrayscaleFilter.applyToPixel(buffer, offset);
                    const distance =  GeometryHelper.getDistanceBetween2DPoints(
                        pixelX, pixelY,
                        coordsRelativeToCanvas.x, coordsRelativeToCanvas.y
                    );

                    const weight = distance / radius;

                    buffer[offset] = weight * grayscale + (1 - weight) * buffer[offset];
                    buffer[offset + 1] = weight * grayscale + (1 - weight) * buffer[offset + 1];
                    buffer[offset + 2] = weight * grayscale + (1 - weight) * buffer[offset + 2];
                    buffer[offset + 3] = 255;
                }
            }
          

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

