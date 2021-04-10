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

            applyGrayscaleFilter(imageData.data);

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
            animation.canvas.style.left = ( (video.offsetWidth / video.videoWidth) * -100) + '%';

            // due to object-fit:cover, all video width is not visible into <video> tag
            // So instead of use only "video.offsetWidth" we also use the video ratio
            animation.canvas.width =  video.offsetWidth * ( video.videoWidth  / video.videoHeight);

            // the whole height video is rendered into <video> tag
            animation.canvas.height =  video.offsetHeight;
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

