import Animation from '../../shared/animation.model';


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

                lut[redOffset * 65536 + greenOffset * 256 + blueOffset] = Array.from(rgb);
                vec3Pool.recycle(rgb);
                vec3Pool.getOne(hsl);
            }
        }
    }

    return lut;
}

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('tuto-video');
    const fpsLabel = document.getElementById('fps');
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
            const imageData = extractVideoImageData(video, canvas.width, canvas.height);
            const buffer = imageData.data;
        
            for (let offset = 0; offset < buffer.length; offset += 4) {
                const r = buffer[offset];
                const g = buffer[offset + 1];
                const b = buffer[offset + 2];

                // 65536 = 256 * 256
                const lutIndex = r * 65536 + g * 256 + b;
              

                const color = window.lut[lutIndex];

                buffer[offset] = color[0];
                buffer[offset + 1] = color[1];
                buffer[offset + 2] = color[2];
                buffer[offset + 3] = 255;
            
            }
            nbFrameRendered++;
            animation.clear();
            context.putImageData(imageData, 0, 0);
        }
    });

    setInterval(() => {
        fpsLabel.textContent = nbFrameRendered;
        nbFrameRendered = 0;
    }, 1000);

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

