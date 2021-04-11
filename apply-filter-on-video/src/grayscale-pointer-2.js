import Animation from '../../shared/animation.model';
import PointerCoordsHelper from "../../shared/pointer-coords.helper";
import CollisionHelper from "../../shared/collision.helper";
import ImageProcessing from "image-processing";
import GeometryHelper from "../../shared/geometry.helper";



document.addEventListener('DOMContentLoaded', () => {
    // Create canvas for video's pixel extraction
    const extractPixelCanvas = document.createElement('canvas');
    const extractPixelContext = extractPixelCanvas.getContext('2d');

    function extractVideoImageData(video, width, height) {
        extractPixelCanvas.width =  width;
        extractPixelCanvas.height = height;

        extractPixelContext.drawImage(video, 0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
        return extractPixelContext.getImageData(0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
    }

    // get our video element
    const video = document.getElementById('tuto-video');

    const pointerCoords = { x: 0, y: 0};

    document.addEventListener('pointermove', event => {
        pointerCoords.x = event.clientX;
        pointerCoords.y = event.clientY;
    });

    // get grayscale value for a pixel in buffer
    function rgbToGrayscale(buffer, offset) {
        return Math.ceil((
            0.30 * buffer[offset] +
            0.59 * buffer[offset + 1] +
            0.11 * buffer[offset + 2]
        ) * (buffer[offset + 4] / 255.0));
    }

    /**
     * @param {Uint8Array} pixelBuffer 
     */
    function applyGrayscaleFilter(pixelBuffer) {
        for (let offset = 0; offset <pixelBuffer.length; offset += 4) {
            const grayscale = rgbToGrayscale(pixelBuffer, offset);
            pixelBuffer[offset] = grayscale;
            pixelBuffer[offset + 1] = grayscale;
            pixelBuffer[offset + 2] = grayscale;
            pixelBuffer[offset + 3] = 255;
        }
    }

    const animation = new Animation({
        canvas: document.getElementById('tuto-canvas'),
        render: (context, canvas) => {

            const imageData = extractVideoImageData(video, canvas.width, canvas.height);


            const coordsRelativeToCanvas = PointerCoordsHelper.getCoordsRelativeToElement(
                canvas,
                pointerCoords.x,
                pointerCoords.y
            );

            // as i use object-fit cover css property to alter video and canvas shape
            // i have to use this hook to resync mouse position and real canvas visible content
            let x_min = 0;
            let x_max = canvas.width;
            let y_min = 0;
            let y_max = canvas.height;

            const style = getComputedStyle(animation.canvas);
            if (animation.canvas.width !== video.offsetWidth) {
                const offset = parseInt(style.left);
                x_min -= offset;
                x_max = x_min + video.offsetWidth;
            }

            if (animation.canvas.height !== video.offsetHeight) {
                const offset = parseInt(style.top);
                y_min -= offset;
                y_max = y_min + video.offsetHeight;
            }

            const buffer = imageData.data;
            // step 3 - apply to the whole buffer, execept a circle defined by pointer position
            for (let offset = 0; offset < buffer.length; offset += 4) {
                const pixelOffset = (offset / 4); // pixels have 4 channel in ImageData
                const pixelX = pixelOffset % canvas.width;
                const pixelY = pixelOffset / canvas.width;

                const radius = 50;

                const isInCircle = CollisionHelper.isPointInCircle(
                    pixelX, pixelY,
                    coordsRelativeToCanvas.x, coordsRelativeToCanvas.y,
                    radius
                );



                const grayscale = rgbToGrayscale(buffer, offset);

                if (isInCircle === false) {
                    buffer[offset] = grayscale;
                    buffer[offset + 1] = grayscale;
                    buffer[offset + 2] = grayscale;
                    buffer[offset + 3] = 255;
                }

                else {
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
            context.putImageData(imageData, 0, 0);
        }
    });

    video.addEventListener('loadeddata', () => {
        if (video.videoWidth < video.videoHeight) {
            animation.canvas.style.top = ((video.offsetHeight / video.videoHeight) * -100) + '%';

            // due to object-fit:cover, all video height is not visible into <video> tag
            // So instead of use only "video.offsetHeight" we also use the video ratio
            animation.canvas.height =  video.offsetHeight * ( video.videoHeight / video.videoWidth);

            // the whole width video is rendered into <video> tag
            animation.canvas.width = video.offsetWidth;
        }

        else {
            // due to object-fit:cover, all video width is not visible into <video> tag
            // So instead of use only "video.offsetWidth" we also use the video ratio
            animation.canvas.width =  video.offsetWidth * ( video.videoWidth  / video.videoHeight);

            // the whole height video is rendered into <video> tag
            animation.canvas.height =  video.offsetHeight;

            animation.canvas.style.left = ( (video.offsetWidth / video.videoWidth) * -100) + '%';
        }


        animation.context.width = video.offsetWidth;
        animation.context.height = video.offsetHeight;
        animation.canvas.style.width = animation.canvas.style.width + 'px';
        animation.canvas.style.height = animation.canvas.style.height + 'px';
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

    window.video = video;
    window.animation = animation;
});

