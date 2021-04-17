import Animation from '../../shared/animation.model';

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
    let offset = 0;
    const length = pixelBuffer.length;
    while (offset < length) {
        const grayscale = Math.ceil((
            0.30 * pixelBuffer[offset] +
            0.59 * pixelBuffer[offset + 1] +
            0.11 * pixelBuffer[offset + 2]
        ) * (pixelBuffer[offset + 4] / 255.0));

        pixelBuffer[offset] = grayscale;
        pixelBuffer[offset + 1] = grayscale;
        pixelBuffer[offset + 2] = grayscale;
        pixelBuffer[offset + 3] = 255;

        offset += 4;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('tuto-video');
    const fpsLabel = document.getElementById('fps');
    let lastBuffer = null;
    window.lastBuffer = lastBuffer;
    let nbFrameRendered = 0;

    // Create canvas for video's pixel extraction
    const extractPixelCanvas = document.createElement('canvas');
    const extractPixelContext = extractPixelCanvas.getContext('2d');

    function extractVideoImageData(video, width, height) {
        if (extractPixelCanvas.width !==  width) {
            extractPixelCanvas.width =  width;
        }

        if (extractPixelCanvas.height !==  height) {
            extractPixelCanvas.height = height;
        }

        extractPixelContext.drawImage(video, 0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
        return extractPixelContext.getImageData(0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
    }

    function shallowCopy(target, source) {
        let i = 0;
        const length = target.length;
        while (i < length) {
            target[i] = source[i];
            i++;
        }
    }

    class BufferPool {
        constructor(bufferLength) {
            this.bufferLength = bufferLength;
            this.instances = [];
            this.index = -1;
        }

        initialize(instance, fromBuffer = null) {
            if (
                fromBuffer !== null &&
                fromBuffer.length === instance.length
            ) {
                shallowCopy(instance, fromBuffer);
            }
        }

        getOne(fromBuffer = null) {
            let instance = null;
            if (this.index >= 0) {
                instance = this.instances[this.index];
                //this.initialize(instance, fromBuffer);
                this.index--;
            }

            else {
                instance = new Uint8ClampedArray(this.bufferLength);
                // instance.length = ;
                //this.initialize(instance, fromBuffer);
            }

            return instance;
        }

        recycle(instance) {
            this.instances[this.index + 1] = instance;
            this.index++;
        }
    }

    function initializeHistory(buffersArray, depth, size = 0) {
        if (buffersArray.length !== depth) {
            buffersArray.length = depth;
        }

        for (let i = 0; i < depth; i++) {
            if ((buffersArray[i] instanceof Uint8ClampedArray) === false) {
                buffersArray[i] = new Uint8ClampedArray(size);
            }
        }
    }

    const persistanceInput = document.querySelector('input[name="persistance"]');
    const historyInput = document.querySelector('input[name="history"]');

    const state = {
        currentOffset: 0,
        persistanceFactor: 0
    };

  
    let historyLength = historyInput.value;
    let diffHistory = Array(historyLength);

    let persistance = persistanceInput.value;
    window.persistance = persistance;
    
    state.persistanceFactor = window.persistance / historyLength;
    
 
    function getHistoryBuffer(index) {
        const bufferIndex = (state.currentOffset + index) % historyLength;
        return diffHistory[bufferIndex];
    }

    function computeMovement(target, newFrame, oldFrame) {
        let offset = 0;
        const length = newFrame.length;
        while(offset < length) {
            target[offset] = Math.abs(newFrame[offset] - oldFrame[offset]);
            target[offset + 1] = Math.abs(newFrame[offset + 1] - oldFrame[offset + 1]);
            target[offset + 2] = Math.abs(newFrame[offset + 2] - oldFrame[offset + 2]);
            offset += 4;
        }
    }
    
    function computePersistance(buffer) {
        let indexedHistoryBuffer = Array(historyLength);
        let weights = Array(historyLength);
        for (let k = 0; k < historyLength; k++) {
            indexedHistoryBuffer[k] = getHistoryBuffer(k);
            weights[k] = state.persistanceFactor * (k / historyLength);
        }

        const length = buffer.length;
        let pixelOffset = 0;
        let historyBufferOffset, historyBuffer;
        let c1, c2, c3, c4;
        while (pixelOffset < length) {
            c1 = pixelOffset;
            c2 = c1 + 1;
            c3 = c2 + 1;
            c4 = c3 + 1;

            buffer[pixelOffset] = 0;
            buffer[c2] = 0;
            buffer[c3] = 0;
            buffer[c4] = 255;

            historyBufferOffset = historyLength - 1
            while (historyBufferOffset >= 0) {
                historyBuffer = indexedHistoryBuffer[historyBufferOffset];
                buffer[pixelOffset] += weights[historyBufferOffset] * historyBuffer[pixelOffset];
                buffer[c2] += weights[historyBufferOffset] * historyBuffer[c2];
                buffer[c3] += weights[historyBufferOffset] * historyBuffer[c3];

                historyBufferOffset--
            }


            pixelOffset++;
        }

    }

    setInterval(() => {
        fpsLabel.textContent = nbFrameRendered;
        nbFrameRendered = 0;
    }, 1000);

    const tutoCanvas =  document.getElementById('tuto-canvas');
    let pixelBufferSize =  tutoCanvas.width * tutoCanvas.height * 4;
    let bufferPool;


    persistanceInput.addEventListener('change', () => {
        window.persistance = persistanceInput.value;
        state.persistanceFactor = window.persistance / historyLength;
    });

    
    
    historyInput.addEventListener('change', () => {
        historyLength = historyInput.value;
        diffHistory = Array(historyLength);
        initializeHistory(diffHistory, historyLength, pixelBufferSize);
        state.persistanceFactor = window.persistance / historyLength;
    });




    const animation = new Animation({
        canvas: document.getElementById('tuto-canvas'),
        render: (context, canvas) => {
            const imageData = extractVideoImageData(video, canvas.width, canvas.height);
            const buffer = imageData.data;
            applyGrayscaleFilter(buffer);

            // first rendering
            if (lastBuffer ===  null) {
                lastBuffer = buffer.slice(0);
                window.lastBuffer = lastBuffer;
                return;
            }


            // const diffBuffer = new Uint8Array(buffer.length);
            // const persistanceBuffer = new Uint8Array(buffer.length);
            const diffBuffer = bufferPool.getOne();
            const persistanceBuffer = bufferPool.getOne();
            computeMovement(diffBuffer,  buffer, window.lastBuffer);
            computePersistance(persistanceBuffer);

            shallowCopy(lastBuffer, buffer);

            // step 5 - diff with persistance
            for (let offset = 0; offset <   buffer.length; offset += 4) {
                buffer[offset] = Math.ceil(Math.min(255, diffBuffer[offset] + persistanceBuffer[offset]));
                buffer[offset + 1] = Math.ceil(Math.min(255, diffBuffer[offset + 1] + persistanceBuffer[offset + 1]));
                buffer[offset + 2] = Math.ceil(Math.min(255, diffBuffer[offset + 2] + persistanceBuffer[offset + 2]));
                buffer[offset + 3] = 255;

                // diffBuffer[offset] =  Math.abs(buffer[offset] - window.lastBuffer[offset]);
                // diffBuffer[offset + 1] =  Math.abs(buffer[offset + 1] - window.lastBuffer[offset + 1]);
                // diffBuffer[offset + 2] =  Math.abs(buffer[offset + 2] - window.lastBuffer[offset + 2]);
                // diffBuffer[offset + 3] = 255;
            }

            let currentHistoryBuffer = diffHistory[state.currentOffset];
            shallowCopy(currentHistoryBuffer, diffBuffer);

            nbFrameRendered++;
            state.currentOffset = nbFrameRendered % historyLength;


            bufferPool.recycle(diffBuffer);
            bufferPool.recycle(persistanceBuffer);

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

        const bufferSize = animation.canvas.width *  animation.canvas.height * 4;
        pixelBufferSize = bufferSize;
        bufferPool = new BufferPool(bufferSize);
        initializeHistory(diffHistory, historyLength, bufferSize);
        // bufferPool.resizeBuffer( );
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
        if (animation.isPlaying === false) {
            animation.askRendering();
        }
    })
});

