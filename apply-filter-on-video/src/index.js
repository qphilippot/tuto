import Animation from '../../shared/animation.model';
import  ImageProcessing  from 'image-processing';

function shallowCopy(target, source) {
    source.forEach((value, index) => {
        target[index] = value;
    });
}


function applyGrayscaleFilter(pixelBuffer) {
    for (let offset = 0; offset <pixelBuffer.length; offset += 4) {
        const grayscale = ImageProcessing.RGBToGrayscaleFilter.applyToPixel(pixelBuffer, offset);
        pixelBuffer[offset] = grayscale;
        pixelBuffer[offset + 1] = grayscale;
        pixelBuffer[offset + 2] = grayscale;
        pixelBuffer[offset + 3] = 255;
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

        // else {
          
        //     instance.fill(0);
        // }
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

document.addEventListener('DOMContentLoaded', () => {
    const persistanceInput = document.querySelector('input[name="persistance"]');
    const historyInput = document.querySelector('input[name="history"]');
    const video = document.getElementById('tuto-video');

    const state = {
        currentOffset: 0,
        persistanceFactor: 0
    };

    let lastBuffer = null;
    window.lastBuffer = lastBuffer;
  
    let historyLength = historyInput.value;
    let diffHistory = Array(historyLength);
    
    let nbFrameRendered = 0;
    let persistance = persistanceInput.value;
    window.persistance = persistance;
    
    state.persistanceFactor = window.persistance / historyLength;
    
 
    function getHistoryBuffer(index) {
        const bufferIndex = (state.currentOffset + index) % historyLength;
        return diffHistory[bufferIndex];
    }

    function computeMovement(target, newFrame, oldFrame) {
        for (let offset = 0; offset < newFrame.length; offset += 4) {
            target[offset] = Math.abs(newFrame[offset] - oldFrame[offset]);
            target[offset + 1] = Math.abs(newFrame[offset + 1] - oldFrame[offset + 1]); 
            target[offset + 2] = Math.abs(newFrame[offset + 2] - oldFrame[offset + 2]); 
            target[offset + 3] = 255;
        }
    }
    
    function computePersistance(buffer) {
        let indexedHistoryBuffer = Array(historyLength);
        for (let k = 0; k < historyLength; k++) {
            indexedHistoryBuffer[k] = getHistoryBuffer(k);
        }

        for (let pixelOffset = 0; pixelOffset < buffer.length; pixelOffset++) {
            buffer[pixelOffset] = 0;
            buffer[pixelOffset + 1] = 0;
            buffer[pixelOffset + 2] = 0;
            buffer[pixelOffset + 3] = 255;
            for (let historyBufferOffset = historyLength - 1; historyBufferOffset >= 0; historyBufferOffset--) {
                const weight = state.persistanceFactor * (historyBufferOffset / historyLength);
                const historyBuffer = indexedHistoryBuffer[historyBufferOffset];
                buffer[pixelOffset] += weight * historyBuffer[pixelOffset];
                buffer[pixelOffset + 1] += weight * historyBuffer[pixelOffset + 1];
                buffer[pixelOffset + 2] += weight * historyBuffer[pixelOffset + 2];
            }
        }
    }

    function getValue(offset, currentBuffer) {
        let lastValue = 0;
        // warning : Uint8ClampedArray is not ... An Array (wtf Javascript ?)
        // --> Don't use Array.isArray() with your instance, it will return false
        if (window.lastBuffer instanceof Uint8ClampedArray) {
            lastValue = window.lastBuffer[offset]
        }


        let value = Math.abs(currentBuffer[offset] - lastValue);

        for (let i = historyLength - 1; i >= 0; --i) {
            const weight = (window.persistance / historyLength) * i;
            const historyBuffer = getHistoryBuffer(i);
            value += weight * historyBuffer[offset];
        }
        
        return Math.min(255, value);
    }

    const tutoCanvas =  document.getElementById('tuto-canvas');
    const pixelBufferSize =  tutoCanvas.width * tutoCanvas.height * 4;
    initializeHistory(diffHistory, historyLength, pixelBufferSize);

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


    const bufferPool = new BufferPool(pixelBufferSize);

    const animation = new Animation({
        canvas: tutoCanvas,
        render: (context, canvas) => {
            const fakeCanvas = document.createElement('canvas');
            fakeCanvas.width =  canvas.width;
            fakeCanvas.height = canvas.height;

           
            const fakeContext = fakeCanvas.getContext('2d');
            fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height);

            const fakeImageData = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);

            applyGrayscaleFilter(fakeImageData.data);
       
            if (window.lastBuffer ===  null) {
                lastBuffer = fakeImageData.data.slice(0);
                window.lastBuffer = lastBuffer;
                return;
            }
            

            // const diffBuffer = new Uint8Array(buffer.length);
            const diffBuffer = bufferPool.getOne();
            const persistanceBuffer = bufferPool.getOne();
            computeMovement(diffBuffer,  fakeImageData.data, window.lastBuffer);
            computePersistance(persistanceBuffer);
     
            shallowCopy(lastBuffer, fakeImageData.data);

            // step 5 - diff with persistance
            for (let offset = 0; offset <   fakeImageData.data.length; offset += 4) {               
                fakeImageData.data[offset] = Math.min(255, diffBuffer[offset] + persistanceBuffer[offset]);
                fakeImageData.data[offset + 1] = Math.min(255, diffBuffer[offset + 1] + persistanceBuffer[offset + 1]);
                fakeImageData.data[offset + 2] = Math.min(255, diffBuffer[offset + 2] + persistanceBuffer[offset + 2]);
                fakeImageData.data[offset + 3] = 255;

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
        if (animation.isPlaying === false) {
            animation.askRendering();
        }
    })
});

