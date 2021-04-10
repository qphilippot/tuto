import Animation from '../../shared/animation.model';
import  ImageProcessing  from 'image-processing';


class Vec3Pool {
    constructor() {
        this.instances = [];
        this.index = -1;
    }
    

    getOne() {
        let instance = null;
        if (this.index >= 0) {
            instance = this.instances[this.index];
            this.index--;
        }
 
        else {
            instance = new Array(3);
        }
 
        return instance;
    }
 
    recycle(instance) {
        this.instances[this.index + 1] = instance;
        this.index++;
    }
}

window.vec3Pool = new Vec3Pool();

function rgbToHSL(rgb, hsl = new Array(3)) {
    // The R,G,B values are divided by 255 to change the range from 0..255 to 0..1
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const delta = max - min;

    let hue = 60;

    if (delta === 0) {
        hue = 0;
    }

    else if (max === r) {  
        hue *= (((g - b) / delta) % 6);
    }

    else if (max === g) {
        hue *= (((b - r) / delta) + 2);
    }

    else {
        hue *= (((r - g) / delta) + 4);
    }


    const lue = (max + min) / 2;

    let saturation = 0;

    if (delta !== 0) {
        saturation = delta / ( 1 - Math.abs(2 * lue - 1));
    }

    hsl[0] = hue;
    hsl[1] = saturation;
    hsl[2] = lue;

    return hsl;
}


function hslToRGB(hsl, rgb = new Array(3)) {
    const c = (1 - Math.abs(2 * hsl[2] - 1)) * hsl[1];
    const x = c * (1 - Math.abs(((hsl[0] / 60) % 2) - 1));
    const m = hsl[2] - c / 2;

    let r, g, b;

    const hue = hsl[0];

    if (hue >= 0 && hue < 60) {
        r = c;
        g = x;
        b = 0;
    }

    else if (hue >= 60 && hue < 120) {
        r = x;
        g = c;
        b = 0;  
    }

    else if (hue >= 120 && hue < 180) {
        r = 0;
        g = c;
        b = x;  
    }

    else if (hue >= 180 && hue < 240) {
        r = 0;
        g = x;
        b = c;  
    }

    else if (hue >= 240 && hue < 300) {
        r = x;
        g = 0;
        b = c;  
    }

    else if (hue >= 300 && hue < 360) {
        r = c;
        g = 0;
        b = x;  
    }

    rgb[0] = Math.max(0, Math.min(Math.round((r + m) * 255), 255));
    rgb[1] = Math.max(0, Math.min(Math.round((g + m) * 255)));
    rgb[2] = Math.max(0, Math.min(Math.round((b + m) * 255)));

    return rgb;

}

function generateRedToBlueLUT() {
    const size = 16777216; // 256 * 256 * 256
    const lut = new Array(size);

    for (let i = 0; i < size; i++) {
        lut[i] = [255, 0, 0];
    }

    for (let redOffset = 0; redOffset < 256; redOffset++) {
        for (let greenOffset = 0; greenOffset < 256; greenOffset++) {
            for (let blueOffset = 0; blueOffset < 256; blueOffset++) {
                const rgb = vec3Pool.getOne();
                const hsl = vec3Pool.getOne();
                rgb[0] = redOffset;
                rgb[1] = greenOffset;
                rgb[2] = blueOffset; 

              
                rgbToHSL(rgb, hsl);

                hsl[1] = Math.max(0, Math.min(hsl[1], 1));
                hsl[2] = Math.max(0, Math.min(hsl[2], 1));
                
                if (hsl[0] < 0) {
                    hsl[0] += 360;
                }

                hsl[0] = hsl[0] % 360;

                if (hsl[0] > 340 && hsl[2] < 0.85) {
                    hsl[0] -= 120;
                }

                else if (hsl[0] < 20 && hsl[2] < 0.85) {
                    hsl[0] += 240;
                }

                if (hsl[0] < 0) {
                    hsl[0] += 360;
                }

                hsl[0] = hsl[0] % 360;

              

                hslToRGB(hsl, rgb);

                lut[redOffset * 256*256 + greenOffset * 256 + blueOffset] = Array.from(rgb);
                vec3Pool.recycle(rgb);
                vec3Pool.getOne(hsl);
            }
        }
    }

    return lut;
}

function shallowCopy(target, source) {
    source.forEach((value, index) => {
        target[index] = value;
    });
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
    const video = document.getElementById('tuto-video');


    // function generateLUT(colorsStep) {
    //     const dynamique = 256;
    //     const lut = new Array(dynamique); // 0..255 -> 256 colors
       

    //     colorsStep.sort((a, b) => a.threshold - b.threshold);

    //     let currentStep = null;
    //     let nextStep = null;
    //     let stepIndex = 0;
    //     let i = 0;

    //     lut[0] = colorsStep[0].color;
    //     i++;

    //     while (i < dynamique) {
           
    //         let percent = i / dynamique;

    //         while (
    //             stepIndex < colorsStep.length - 1 &&
    //             percent >= colorsStep[stepIndex + 1].threshold
    //         ) {
    //             stepIndex++;
    //         }
            
    //         if (stepIndex === colorsStep.length - 1) {
    //             while(i < dynamique) {
    //                 lut[i] = [
    //                     colorsStep[stepIndex].color[0], 
    //                     colorsStep[stepIndex].color[1], 
    //                     colorsStep[stepIndex].color[2]
    //                 ];
    
    //                 i++;
    //             }
    //         }

    //         else {
    //             currentStep = colorsStep[stepIndex];
    //             nextStep = colorsStep[stepIndex + 1];
    //             const borneInf = i;
    //             const borneSup = Math.ceil(nextStep.threshold * dynamique);
    //             const borneSize = borneSup - borneInf;
                
    //             const step = [
    //                 (nextStep.color[0] - currentStep.color[0]) / borneSize,
    //                 (nextStep.color[1] - currentStep.color[1]) / borneSize,
    //                 (nextStep.color[2] - currentStep.color[2]) / borneSize
    //             ]; 
    
    //             //console.log(currentStep.color.slice(0), nextStep.color.slice(0), step.slice(0), borneSize, borneInf, borneSup, nextStep.threshold)
    //             // interpolate colors
    //             while(i < borneSup) {
    //                 lut[i] = [
    //                     lut[i - 1][0] + step[0], 
    //                     lut[i - 1][1] + step[1], 
    //                     lut[i - 1][2] + step[2] 
    //                 ];
    
    //                 i++;
    //             }
    //         }
    //     }

    //     // Always avoid floating values with color intensity
    //     for (let j = 0; j < lut.length; j++) {
    //         lut[j][0] = Math.ceil(lut[j][0]);
    //         lut[j][1] = Math.ceil(lut[j][1]);
    //         lut[j][2] = Math.ceil(lut[j][2]);
    //     }

    //     return lut;
    // }
  
    // window.lut = generateLUT(colorsContraints);
    window.lut = generateRedToBlueLUT();

    const tutoCanvas =  document.getElementById('tuto-canvas');


    const animation = new Animation({
        canvas: tutoCanvas,
        render: (context, canvas) => {
            const fakeCanvas = document.createElement('canvas');
            fakeCanvas.width =  canvas.width;
            fakeCanvas.height = canvas.height;

           
            const fakeContext = fakeCanvas.getContext('2d');
            fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height);

            const fakeImageData = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);

            // applyGrayscaleFilter(fakeImageData.data);
           
        
            for (let offset = 0; offset < fakeImageData.data.length; offset += 4) { 
                const r = fakeImageData.data[offset];
                const g = fakeImageData.data[offset + 1];
                const b = fakeImageData.data[offset + 2];

                const lutIndex = r * 256 * 256 + g * 256 + b;
              
                try {
                    const color = lut[lutIndex];      
                    if (color[0] < 0 || color[0]>255) {
                        console.log(r, g, b, lutIndex, lut.length, color.slice(0));
                    }
                    if (color[1] < 0 || color[1]>255) {
                        console.log(r, g, b, lutIndex, lut.length, color.slice(0));
                    }
                    if (color[2] < 0 || color[2]>255) {
                        console.log(r, g, b, lutIndex, lut.length, color.slice(0));
                    }

                    fakeImageData.data[offset] = Math.min(255, Math.floor(color[0]));
                    fakeImageData.data[offset + 1] = Math.min(255, Math.floor(color[1]));
                    fakeImageData.data[offset + 2] = Math.min(255, Math.floor(color[2]));
                    fakeImageData.data[offset + 3] = 255;
                }

                catch(error) {
                    console.error(error);
                    console.log(r, g, b, lutIndex, lut.length);
                    debugger;
                }
            
            }
            
            animation.clear();
            context.putImageData(fakeImageData, 0, 0);
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
        if (animation.isPlaying === false) {
            animation.askRendering();
        }
    })
});

