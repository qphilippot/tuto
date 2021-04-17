/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../shared/animation.model.js":
/*!************************************!*\
  !*** ../shared/animation.model.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Animation {\r\n    constructor(settings = {}) {\r\n        this.canvas = settings.canvas;\r\n        this.context = this.canvas.getContext('2d');\r\n\r\n        if (typeof settings.render === 'function') {\r\n            this.render = settings.render;\r\n        }\r\n\r\n        else {\r\n            throw `You must provide a render method`;\r\n        }\r\n\r\n\r\n        this.isPlaying = false;\r\n    }\r\n\r\n    clear() {\r\n        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n    }\r\n\r\n    pause() {\r\n        this.isPlaying = false;\r\n    }\r\n\r\n    play() {\r\n        this.isPlaying = true;\r\n\r\n        // invoke rendering loop\r\n        this.renderingLoop();\r\n    }\r\n\r\n    askRendering() {\r\n        this.render(this.context, this.canvas);\r\n    }\r\n\r\n    renderingLoop() {\r\n        if (this.isPlaying === true) {\r\n            window.requestAnimationFrame(this.renderingLoop.bind(this));\r\n            this.render(this.context, this.canvas);\r\n        }\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Animation);\n\n//# sourceURL=webpack:///../shared/animation.model.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/animation.model */ \"../shared/animation.model.js\");\n\r\n\r\n\r\nclass Vec3Pool {\r\n    constructor() {\r\n        this.instances = [];\r\n        this.index = -1;\r\n    }\r\n    \r\n\r\n    getOne() {\r\n        let instance = null;\r\n        if (this.index >= 0) {\r\n            instance = this.instances[this.index];\r\n            this.index--;\r\n        }\r\n \r\n        else {\r\n            instance = new Array(3);\r\n        }\r\n \r\n        return instance;\r\n    }\r\n \r\n    recycle(instance) {\r\n        this.instances[this.index + 1] = instance;\r\n        this.index++;\r\n    }\r\n}\r\n\r\nwindow.vec3Pool = new Vec3Pool();\r\n\r\nfunction rgbToHSL(rgb, hsl = new Array(3)) {\r\n    // The R,G,B values are divided by 255 to change the range from 0..255 to 0..1\r\n    const r = rgb[0] / 255;\r\n    const g = rgb[1] / 255;\r\n    const b = rgb[2] / 255;\r\n\r\n    const max = Math.max(r, g, b);\r\n    const min = Math.min(r, g, b);\r\n\r\n    const delta = max - min;\r\n\r\n    let hue = 60;\r\n\r\n    if (delta === 0) {\r\n        hue = 0;\r\n    }\r\n\r\n    else if (max === r) {  \r\n        hue *= (((g - b) / delta) % 6);\r\n    }\r\n\r\n    else if (max === g) {\r\n        hue *= (((b - r) / delta) + 2);\r\n    }\r\n\r\n    else {\r\n        hue *= (((r - g) / delta) + 4);\r\n    }\r\n\r\n\r\n    const lue = (max + min) / 2;\r\n\r\n    let saturation = 0;\r\n\r\n    if (delta !== 0) {\r\n        saturation = delta / ( 1 - Math.abs(2 * lue - 1));\r\n    }\r\n\r\n    hsl[0] = hue;\r\n    hsl[1] = saturation;\r\n    hsl[2] = lue;\r\n\r\n    return hsl;\r\n}\r\n\r\n\r\nfunction hslToRGB(hsl, rgb = new Array(3)) {\r\n    const c = (1 - Math.abs(2 * hsl[2] - 1)) * hsl[1];\r\n    const x = c * (1 - Math.abs(((hsl[0] / 60) % 2) - 1));\r\n    const m = hsl[2] - c / 2;\r\n\r\n    let r, g, b;\r\n\r\n    const hue = hsl[0];\r\n\r\n    if (hue >= 0 && hue < 60) {\r\n        r = c;\r\n        g = x;\r\n        b = 0;\r\n    }\r\n\r\n    else if (hue >= 60 && hue < 120) {\r\n        r = x;\r\n        g = c;\r\n        b = 0;  \r\n    }\r\n\r\n    else if (hue >= 120 && hue < 180) {\r\n        r = 0;\r\n        g = c;\r\n        b = x;  \r\n    }\r\n\r\n    else if (hue >= 180 && hue < 240) {\r\n        r = 0;\r\n        g = x;\r\n        b = c;  \r\n    }\r\n\r\n    else if (hue >= 240 && hue < 300) {\r\n        r = x;\r\n        g = 0;\r\n        b = c;  \r\n    }\r\n\r\n    else if (hue >= 300 && hue < 360) {\r\n        r = c;\r\n        g = 0;\r\n        b = x;  \r\n    }\r\n\r\n    rgb[0] = Math.max(0, Math.min(Math.round((r + m) * 255), 255));\r\n    rgb[1] = Math.max(0, Math.min(Math.round((g + m) * 255)));\r\n    rgb[2] = Math.max(0, Math.min(Math.round((b + m) * 255)));\r\n\r\n    return rgb;\r\n\r\n}\r\n\r\nfunction generateRedToBlueLUT() {\r\n    const size = 16777216; // 256 * 256 * 256\r\n    const lut = new Array(size);\r\n\r\n    for (let i = 0; i < size; i++) {\r\n        lut[i] = [255, 0, 0];\r\n    }\r\n\r\n    for (let redOffset = 0; redOffset < 256; redOffset++) {\r\n        for (let greenOffset = 0; greenOffset < 256; greenOffset++) {\r\n            for (let blueOffset = 0; blueOffset < 256; blueOffset++) {\r\n                const rgb = vec3Pool.getOne();\r\n                const hsl = vec3Pool.getOne();\r\n                rgb[0] = redOffset;\r\n                rgb[1] = greenOffset;\r\n                rgb[2] = blueOffset; \r\n\r\n              \r\n                rgbToHSL(rgb, hsl);\r\n\r\n                hsl[1] = Math.max(0, Math.min(hsl[1], 1));\r\n                hsl[2] = Math.max(0, Math.min(hsl[2], 1));\r\n                \r\n                if (hsl[0] < 0) {\r\n                    hsl[0] += 360;\r\n                }\r\n\r\n                hsl[0] = hsl[0] % 360;\r\n\r\n                if (hsl[0] > 340 && hsl[2] < 0.85) {\r\n                    hsl[0] -= 120;\r\n                }\r\n\r\n                else if (hsl[0] < 20 && hsl[2] < 0.85) {\r\n                    hsl[0] += 240;\r\n                }\r\n\r\n                if (hsl[0] < 0) {\r\n                    hsl[0] += 360;\r\n                }\r\n\r\n                hsl[0] = hsl[0] % 360;\r\n\r\n              \r\n\r\n                hslToRGB(hsl, rgb);\r\n\r\n                lut[redOffset * 65536 + greenOffset * 256 + blueOffset] = Array.from(rgb);\r\n                vec3Pool.recycle(rgb);\r\n                vec3Pool.getOne(hsl);\r\n            }\r\n        }\r\n    }\r\n\r\n    return lut;\r\n}\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    const video = document.getElementById('tuto-video');\r\n    const fpsLabel = document.getElementById('fps');\r\n    let nbFrameRendered = 0;\r\n\r\n    // Create canvas for video's pixel extraction\r\n    const extractPixelCanvas = document.createElement('canvas');\r\n    const extractPixelContext = extractPixelCanvas.getContext('2d');\r\n\r\n    function extractVideoImageData(video, width, height) {\r\n        if (extractPixelCanvas.width !==  width) {\r\n            extractPixelCanvas.width =  width;\r\n        }\r\n\r\n        if (extractPixelCanvas.height !==  height) {\r\n            extractPixelCanvas.height = height;\r\n        }\r\n\r\n        extractPixelContext.drawImage(video, 0, 0, extractPixelCanvas.width, extractPixelCanvas.height);\r\n        return extractPixelContext.getImageData(0, 0, extractPixelCanvas.width, extractPixelCanvas.height);\r\n    }\r\n\r\n\r\n    // function generateLUT(colorsStep) {\r\n    //     const dynamique = 256;\r\n    //     const lut = new Array(dynamique); // 0..255 -> 256 colors\r\n       \r\n\r\n    //     colorsStep.sort((a, b) => a.threshold - b.threshold);\r\n\r\n    //     let currentStep = null;\r\n    //     let nextStep = null;\r\n    //     let stepIndex = 0;\r\n    //     let i = 0;\r\n\r\n    //     lut[0] = colorsStep[0].color;\r\n    //     i++;\r\n\r\n    //     while (i < dynamique) {\r\n           \r\n    //         let percent = i / dynamique;\r\n\r\n    //         while (\r\n    //             stepIndex < colorsStep.length - 1 &&\r\n    //             percent >= colorsStep[stepIndex + 1].threshold\r\n    //         ) {\r\n    //             stepIndex++;\r\n    //         }\r\n            \r\n    //         if (stepIndex === colorsStep.length - 1) {\r\n    //             while(i < dynamique) {\r\n    //                 lut[i] = [\r\n    //                     colorsStep[stepIndex].color[0], \r\n    //                     colorsStep[stepIndex].color[1], \r\n    //                     colorsStep[stepIndex].color[2]\r\n    //                 ];\r\n    \r\n    //                 i++;\r\n    //             }\r\n    //         }\r\n\r\n    //         else {\r\n    //             currentStep = colorsStep[stepIndex];\r\n    //             nextStep = colorsStep[stepIndex + 1];\r\n    //             const borneInf = i;\r\n    //             const borneSup = Math.ceil(nextStep.threshold * dynamique);\r\n    //             const borneSize = borneSup - borneInf;\r\n                \r\n    //             const step = [\r\n    //                 (nextStep.color[0] - currentStep.color[0]) / borneSize,\r\n    //                 (nextStep.color[1] - currentStep.color[1]) / borneSize,\r\n    //                 (nextStep.color[2] - currentStep.color[2]) / borneSize\r\n    //             ]; \r\n    \r\n    //             //console.log(currentStep.color.slice(0), nextStep.color.slice(0), step.slice(0), borneSize, borneInf, borneSup, nextStep.threshold)\r\n    //             // interpolate colors\r\n    //             while(i < borneSup) {\r\n    //                 lut[i] = [\r\n    //                     lut[i - 1][0] + step[0], \r\n    //                     lut[i - 1][1] + step[1], \r\n    //                     lut[i - 1][2] + step[2] \r\n    //                 ];\r\n    \r\n    //                 i++;\r\n    //             }\r\n    //         }\r\n    //     }\r\n\r\n    //     // Always avoid floating values with color intensity\r\n    //     for (let j = 0; j < lut.length; j++) {\r\n    //         lut[j][0] = Math.ceil(lut[j][0]);\r\n    //         lut[j][1] = Math.ceil(lut[j][1]);\r\n    //         lut[j][2] = Math.ceil(lut[j][2]);\r\n    //     }\r\n\r\n    //     return lut;\r\n    // }\r\n  \r\n    // window.lut = generateLUT(colorsContraints);\r\n    window.lut = generateRedToBlueLUT();\r\n\r\n    const tutoCanvas =  document.getElementById('tuto-canvas');\r\n\r\n\r\n    const animation = new _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n        canvas: tutoCanvas,\r\n        render: (context, canvas) => {\r\n            const imageData = extractVideoImageData(video, canvas.width, canvas.height);\r\n            const buffer = imageData.data;\r\n        \r\n            for (let offset = 0; offset < buffer.length; offset += 4) {\r\n                const r = buffer[offset];\r\n                const g = buffer[offset + 1];\r\n                const b = buffer[offset + 2];\r\n\r\n                // 65536 = 256 * 256\r\n                const lutIndex = r * 65536 + g * 256 + b;\r\n              \r\n\r\n                const color = window.lut[lutIndex];\r\n\r\n                buffer[offset] = color[0];\r\n                buffer[offset + 1] = color[1];\r\n                buffer[offset + 2] = color[2];\r\n                buffer[offset + 3] = 255;\r\n            \r\n            }\r\n            nbFrameRendered++;\r\n            animation.clear();\r\n            context.putImageData(imageData, 0, 0);\r\n        }\r\n    });\r\n\r\n    setInterval(() => {\r\n        fpsLabel.textContent = nbFrameRendered;\r\n        nbFrameRendered = 0;\r\n    }, 1000);\r\n\r\n    video.addEventListener('loadeddata', () => {\r\n        if (video.videoWidth < video.videoHeight) {\r\n            animation.canvas.style.top = ((video.offsetHeight / video.videoHeight) * -100) + '%';\r\n\r\n            // due to object-fit:cover, all video height is not visible into <video> tag\r\n            // So instead of use only \"video.offsetHeight\" we also use the video ratio\r\n            animation.canvas.height =  video.offsetHeight * ( video.videoHeight / video.videoWidth);\r\n\r\n            // the whole width video is rendered into <video> tag\r\n            animation.canvas.width = video.offsetWidth;\r\n        }\r\n\r\n        else {\r\n            animation.canvas.style.left = ( (video.offsetWidth / video.videoWidth) * -100) + '%';\r\n\r\n            // due to object-fit:cover, all video width is not visible into <video> tag\r\n            // So instead of use only \"video.offsetWidth\" we also use the video ratio\r\n            animation.canvas.width =  video.offsetWidth * ( video.videoWidth  / video.videoHeight);\r\n\r\n            // the whole height video is rendered into <video> tag\r\n            animation.canvas.height =  video.offsetHeight;\r\n        }\r\n    });\r\n\r\n    video.addEventListener('play', () => {\r\n        animation.play();\r\n    });\r\n    \r\n    video.addEventListener('pause', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('end', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('timeupdate', () => {\r\n        if (animation.isPlaying === false) {\r\n            animation.askRendering();\r\n        }\r\n    })\r\n});\r\n\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });