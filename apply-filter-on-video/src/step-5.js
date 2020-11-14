import Animation from '../../shared/animation.model';
import  ImageProcessing  from 'image-processing';
import CollisionHelper from '../../shared/collision.helper';
import GeometryHelper from '../../shared/geometry.helper';


function applyGrayscaleFilter(pixelBuffer) {
    for (let offset = 0; offset <pixelBuffer.length; offset += 4) {
        const grayscale = ImageProcessing.RGBToGrayscaleFilter.applyToPixel(pixelBuffer, offset);
        pixelBuffer[offset] = grayscale;
        pixelBuffer[offset + 1] = grayscale;
        pixelBuffer[offset + 2] = grayscale;
        pixelBuffer[offset + 3] = 255;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const persistanceInput = document.querySelector('input[name="persistance"]');
    const historyInput = document.querySelector('input[name="history"]');

    
    const video = document.getElementById('tuto-video');
    let lastBuffer = null;
    window.lastBuffer = lastBuffer;
    let lastDiffBuffer = null;
    let historyLength = historyInput.value;
    let diffHistory = Array(historyLength);
    let nbFrameRendered = 0;
    let persistance = persistanceInput.value;
    
    persistanceInput.addEventListener('change', () => {
        persistance = persistanceInput.value;
    });

    
    historyInput.addEventListener('change', () => {
        historyLength = historyInput.value;
        diffHistory = Array(historyLength);
    });

    function getHistoryBuffer(index) {
        const currentOffset = nbFrameRendered % historyLength;
        const bufferIndex = (currentOffset + index) % historyLength;
        return diffHistory[bufferIndex];
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
            const weight = (persistance / historyLength) * i;
            const historyBuffer = getHistoryBuffer(i);
            if (historyBuffer instanceof Uint8ClampedArray) {
               value += weight * historyBuffer[offset];
            }
        }
        
        // console.log(value);
        return Math.min(255, value);
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

       
            if (lastBuffer ===  null) {
                lastBuffer = buffer.slice(0);
                console.log('not null anymore');
                window.lastBuffer = lastBuffer;
                return;
            }

            
      
            //applyGrayscaleFilter(buffer) ;
            const diffBuffer = new Uint8Array(buffer.length);
     

           

            // step 4, 4.1 - Diff buffer
            // for (let offset = 0; offset < buffer.length; offset += 4) {
            //     const diff = Math.abs(buffer[offset] - lastBuffer[offset]);
            //     if (lastDiffBuffer === null) {
            //         diffBuffer[offset] =  Math.abs(buffer[offset] - lastBuffer[offset]);
            //         diffBuffer[offset + 1] =  Math.abs(buffer[offset + 1] - lastBuffer[offset + 1]); 
            //         diffBuffer[offset + 2] =  Math.abs(buffer[offset + 2] - lastBuffer[offset + 2]); 
            //         diffBuffer[offset + 3] = 255;
            //     }

            //     else {
            //         diffBuffer[offset] = 0.5 * lastDiffBuffer[offset] + Math.abs(buffer[offset] - lastBuffer[offset]) ;
            //         diffBuffer[offset + 1] =  0.5 * lastDiffBuffer[offset + 1] + Math.abs(buffer[offset + 1] - lastBuffer[offset + 1]); 
            //         diffBuffer[offset + 2] =  0.5 * lastDiffBuffer[offset + 2] + Math.abs(buffer[offset + 2] - lastBuffer[offset + 2]); 
            //         diffBuffer[offset + 3] = 255;
            //     }
            // }
          
            // lastBuffer = buffer.slice(0);
            // lastDiffBuffer = diffBuffer.slice(0);

            // diffBuffer.forEach((value, index) => {
            //     fakeImageData.data[index] = value;
            // });
            // fakeImageData.data = diffBuffer;

            // step 5 - diff with persistance
            for (let offset = 0; offset < buffer.length; offset += 4) {               
                // diffBuffer[offset] = getValue(offset, buffer);
                // diffBuffer[offset + 1] = getValue(offset + 1, buffer);
                // diffBuffer[offset + 2] = getValue(offset + 2, buffer);
                // diffBuffer[offset + 3] = 255;

                diffBuffer[offset] =  Math.abs(buffer[offset] - window.lastBuffer[offset]);
                diffBuffer[offset + 1] =  Math.abs(buffer[offset + 1] - window.lastBuffer[offset + 1]); 
                diffBuffer[offset + 2] =  Math.abs(buffer[offset + 2] - window.lastBuffer[offset + 2]); 
                diffBuffer[offset + 3] = 255;
            }
            
            window.lastBuffer = buffer.slice(0);
            const currentOffset = nbFrameRendered % historyLength;
            diffHistory[currentOffset] = diffBuffer.slice(0);
            nbFrameRendered++;

            diffBuffer.forEach((value, index) => {
                fakeImageData.data[index] = value;
            });

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

