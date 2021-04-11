import Animation from '../../shared/animation.model';

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
            const boundingBox = canvas.getBoundingClientRect();


            // as i use object-fit cover css property to alter video and canvas shape
            // i have to use this hook to resync mouse position and real canvas visible content
            let x_min = boundingBox.left;
            let x_max = boundingBox.right;
            let y_min = boundingBox.top;
            let y_max = boundingBox.bottom;

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

            const isPointerHoverCanvas = (
                pointerCoords.x >= x_min &&
                pointerCoords.y >= y_min &&
                pointerCoords.x < x_max &&
                pointerCoords.y < y_max
            );


            if (isPointerHoverCanvas === false) {
                applyGrayscaleFilter(imageData.data) ;
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

