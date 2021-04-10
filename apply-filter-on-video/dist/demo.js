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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/grayscale-pointer-1.js");
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

/***/ "../shared/pointer-coords.helper.js":
/*!******************************************!*\
  !*** ../shared/pointer-coords.helper.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass PointerCoordsHelper {\r\n    constructor() {}\r\n\r\n    /**\r\n     * \r\n     * @param {Element} element \r\n     * @param {Number} x \r\n     * @param {Number} y \r\n     */\r\n    getCoordsRelativeToElement(element, x, y) {\r\n        const boundingBox = element.getBoundingClientRect();\r\n\r\n        console.log(boundingBox, element.parentElement.getBoundingClientRect());\r\n\r\n        return {\r\n            x: x - boundingBox.left,\r\n            y: y - boundingBox.top\r\n        };\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (new PointerCoordsHelper());\n\n//# sourceURL=webpack:///../shared/pointer-coords.helper.js?");

/***/ }),

/***/ "./src/grayscale-pointer-1.js":
/*!************************************!*\
  !*** ./src/grayscale-pointer-1.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/animation.model */ \"../shared/animation.model.js\");\n/* harmony import */ var _shared_pointer_coords_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/pointer-coords.helper */ \"../shared/pointer-coords.helper.js\");\n\r\n\r\n\r\n\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    // Create canvas for video's pixel extraction\r\n    const extractPixelCanvas = document.createElement('canvas');\r\n    const extractPixelContext = extractPixelCanvas.getContext('2d');\r\n\r\n    function extractVideoImageData(video, width, height) {\r\n        extractPixelCanvas.width =  width;\r\n        extractPixelCanvas.height = height;\r\n\r\n        extractPixelContext.drawImage(video, 0, 0, extractPixelCanvas.width, extractPixelCanvas.height);\r\n        return extractPixelContext.getImageData(0, 0, extractPixelCanvas.width, extractPixelCanvas.height);\r\n    }\r\n\r\n    // get our video element\r\n    const video = document.getElementById('tuto-video');\r\n\r\n    const pointerCoords = { x: 0, y: 0};\r\n\r\n    document.addEventListener('pointermove', event => {\r\n        pointerCoords.x = event.clientX;\r\n        pointerCoords.y = event.clientY;\r\n    });\r\n\r\n    // get grayscale value for a pixel in buffer\r\n    function rgbToGrayscale(buffer, offset) {\r\n        return Math.ceil((\r\n            0.30 * buffer[offset] +\r\n            0.59 * buffer[offset + 1] +\r\n            0.11 * buffer[offset + 2]\r\n        ) * (buffer[offset + 4] / 255.0));\r\n    }\r\n\r\n    /**\r\n     * @param {Uint8Array} pixelBuffer \r\n     */\r\n    function applyGrayscaleFilter(pixelBuffer) {\r\n        for (let offset = 0; offset <pixelBuffer.length; offset += 4) {\r\n            const grayscale = rgbToGrayscale(pixelBuffer, offset);\r\n            pixelBuffer[offset] = grayscale;\r\n            pixelBuffer[offset + 1] = grayscale;\r\n            pixelBuffer[offset + 2] = grayscale;\r\n            pixelBuffer[offset + 3] = 255;\r\n        }\r\n    }\r\n\r\n    const animation = new _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n        canvas: document.getElementById('tuto-canvas'),\r\n        render: (context, canvas) => {\r\n\r\n            const imageData = extractVideoImageData(video, canvas.width, canvas.height);\r\n\r\n\r\n            const coordsRelativeToCanvas = _shared_pointer_coords_helper__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getCoordsRelativeToElement(\r\n                canvas,\r\n                pointerCoords.x,\r\n                pointerCoords.y\r\n            );\r\n\r\n            let x_min = 0;\r\n            let x_max = canvas.width;\r\n            let y_min = 0;\r\n            let y_max = canvas.height;\r\n\r\n            if (animation.canvas.width !== video.offsetWidth) {\r\n                const offset = ((video.offsetWidth) - (video.offsetWidth * ( video.videoWidth  / video.videoHeight))) / 2;\r\n                x_min -= offset;\r\n                x_max += offset;\r\n                console.log(offset)\r\n            }\r\n\r\n            if (animation.canvas.height !== video.offsetHeight) {\r\n                const offset =  ((video.offsetHeight) - (video.offsetHeight * ( video.videoHeight  / video.videoWidth))) / 2;\r\n                y_min += offset;\r\n                y_max -= offset;\r\n            }\r\n\r\n            console.log(x_min, y_min, x_max, y_max)\r\n            const isPointerHoverCanvas = (\r\n                coordsRelativeToCanvas.x >= x_min &&\r\n                coordsRelativeToCanvas.y >= y_min &&\r\n                coordsRelativeToCanvas.x < x_max &&\r\n                coordsRelativeToCanvas.y < y_max\r\n            );\r\n\r\n\r\n            if (isPointerHoverCanvas === false) {\r\n                applyGrayscaleFilter(imageData.data) ;\r\n            }\r\n\r\n            animation.clear();\r\n            context.putImageData(imageData, 0, 0);\r\n        }\r\n    });\r\n\r\n    video.addEventListener('loadeddata', () => {\r\n        if (video.videoWidth < video.videoHeight) {\r\n            animation.canvas.style.top = ((video.offsetHeight / video.videoHeight) * -100) + '%';\r\n\r\n            // due to object-fit:cover, all video height is not visible into <video> tag\r\n            // So instead of use only \"video.offsetHeight\" we also use the video ratio\r\n            animation.canvas.height =  video.offsetHeight * ( video.videoHeight / video.videoWidth);\r\n\r\n            // the whole width video is rendered into <video> tag\r\n            animation.canvas.width = video.offsetWidth;\r\n        }\r\n\r\n        else {\r\n            animation.canvas.style.left = ( (video.offsetWidth / video.videoWidth) * -100) + '%';\r\n\r\n            // due to object-fit:cover, all video width is not visible into <video> tag\r\n            // So instead of use only \"video.offsetWidth\" we also use the video ratio\r\n            animation.canvas.width =  video.offsetWidth * ( video.videoWidth  / video.videoHeight);\r\n\r\n            // the whole height video is rendered into <video> tag\r\n            animation.canvas.height =  video.offsetHeight;\r\n        }\r\n    });\r\n\r\n    video.addEventListener('play', () => {\r\n        animation.play();\r\n    });\r\n    \r\n    video.addEventListener('pause', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('end', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('timeupdate', () => {\r\n        animation.askRendering()\r\n    })\r\n});\r\n\r\n\n\n//# sourceURL=webpack:///./src/grayscale-pointer-1.js?");

/***/ })

/******/ });