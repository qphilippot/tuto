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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/step-5+.js");
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

/***/ "./node_modules/image-processing/index.js":
/*!************************************************!*\
  !*** ./node_modules/image-processing/index.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_transformations_filters_RGBToGrayscale_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/transformations/filters/RGBToGrayscale.filter */ \"./node_modules/image-processing/src/transformations/filters/RGBToGrayscale.filter.js\");\n\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n    RGBToGrayscaleFilter: _src_transformations_filters_RGBToGrayscale_filter__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\r\n});\n\n//# sourceURL=webpack:///./node_modules/image-processing/index.js?");

/***/ }),

/***/ "./node_modules/image-processing/src/transformations/filters/RGBToGrayscale.filter.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/image-processing/src/transformations/filters/RGBToGrayscale.filter.js ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n /**\r\n  * \r\n  * @param {Uint8Array} buffer \r\n  * @param {Number} offset \r\n  */\r\n function applyToPixel(buffer, offset) {\r\n    return Math.ceil((\r\n        0.30 * buffer[offset] + \r\n        0.59 * buffer[offset + 1] + \r\n        0.11 * buffer[offset + 2]\r\n    ) * (buffer[offset + 4] / 255.0)); \r\n }\r\n\r\n\r\n \r\n /**\r\n  * @param {Uint8Array} pixels\r\n  * @return {Uint8Array} \r\n  */\r\n function rgbTograyscale(input_pixels, settings = {}) {\r\n    let output_pixels;\r\n    let writePixel;\r\n\r\n    if (settings.format === \"AlphaImageData\") {\r\n        output_pixels = new Uint8Array(input_pixels.length);\r\n        writePixel = (pixelOffset, intensity) => {\r\n            output_pixels[pixelOffset] = 255;\r\n            output_pixels[pixelOffset + 1] = 255;\r\n            output_pixels[pixelOffset + 2] = 255;\r\n            output_pixels[pixelOffset + 3] = intensity\r\n        };\r\n    }\r\n\r\n    else {\r\n        output_pixels = new Uint8Array(input_pixels.length / 4);\r\n        writePixel = (pixelOffset, intensity) => {\r\n            output_pixels[pixelOffset] = intensity;\r\n        };\r\n    }\r\n   \r\n    for (let i = 0; i < input_pixels.length; i += 4) {\r\n        const intensity = applyToPixel(input_pixels, i);\r\n        writePixel(i, intensity);\r\n    }\r\n\r\n    return output_pixels;\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n    filter: rgbTograyscale,\r\n    applyToPixel: applyToPixel\r\n});\r\n\n\n//# sourceURL=webpack:///./node_modules/image-processing/src/transformations/filters/RGBToGrayscale.filter.js?");

/***/ }),

/***/ "./src/step-5+.js":
/*!************************!*\
  !*** ./src/step-5+.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/animation.model */ \"../shared/animation.model.js\");\n/* harmony import */ var image_processing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! image-processing */ \"./node_modules/image-processing/index.js\");\n\r\n\r\n\r\nfunction shallowCopy(target, source) {\r\n    source.forEach((value, index) => {\r\n        target[index] = value;\r\n    });\r\n}\r\n\r\n\r\nfunction applyGrayscaleFilter(pixelBuffer) {\r\n    for (let offset = 0; offset <pixelBuffer.length; offset += 4) {\r\n        const grayscale = image_processing__WEBPACK_IMPORTED_MODULE_1__[\"default\"].RGBToGrayscaleFilter.applyToPixel(pixelBuffer, offset);\r\n        pixelBuffer[offset] = grayscale;\r\n        pixelBuffer[offset + 1] = grayscale;\r\n        pixelBuffer[offset + 2] = grayscale;\r\n        pixelBuffer[offset + 3] = 255;\r\n    }\r\n}\r\n\r\n\r\n\r\nclass BufferPool {\r\n    constructor(bufferLength) {\r\n        this.bufferLength = bufferLength;\r\n        this.instances = [];\r\n        this.index = -1;\r\n    }\r\n    \r\n    initialize(instance, fromBuffer = null) {\r\n        if (\r\n            fromBuffer !== null &&\r\n            fromBuffer.length === instance.length\r\n        ) {\r\n            shallowCopy(instance, fromBuffer);\r\n        }\r\n\r\n        // else {\r\n          \r\n        //     instance.fill(0);\r\n        // }\r\n    }\r\n\r\n    getOne(fromBuffer = null) {\r\n        let instance = null;\r\n        if (this.index >= 0) {\r\n            instance = this.instances[this.index];\r\n            //this.initialize(instance, fromBuffer);\r\n            this.index--;\r\n        }\r\n \r\n        else {\r\n            instance = new Uint8ClampedArray(this.bufferLength);\r\n            // instance.length = ;\r\n            //this.initialize(instance, fromBuffer);\r\n        }\r\n \r\n        return instance;\r\n    }\r\n \r\n    recycle(instance) {\r\n        this.instances[this.index + 1] = instance;\r\n        this.index++;\r\n    }\r\n}\r\n\r\nfunction initializeHistory(buffersArray, depth, size = 0) {\r\n    if (buffersArray.length !== depth) {\r\n        buffersArray.length = depth;\r\n    }\r\n\r\n    for (let i = 0; i < depth; i++) {\r\n        if ((buffersArray[i] instanceof Uint8ClampedArray) === false) {\r\n            buffersArray[i] = new Uint8ClampedArray(size);\r\n        }\r\n    }\r\n}\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    const persistanceInput = document.querySelector('input[name=\"persistance\"]');\r\n    const historyInput = document.querySelector('input[name=\"history\"]');\r\n    const video = document.getElementById('tuto-video');\r\n\r\n    const state = {\r\n        currentOffset: 0,\r\n        persistanceFactor: 0\r\n    };\r\n\r\n    let lastBuffer = null;\r\n    window.lastBuffer = lastBuffer;\r\n  \r\n    let historyLength = historyInput.value;\r\n    let diffHistory = Array(historyLength);\r\n    \r\n    let nbFrameRendered = 0;\r\n    let persistance = persistanceInput.value;\r\n    window.persistance = persistance;\r\n    \r\n    state.persistanceFactor = window.persistance / historyLength;\r\n    \r\n \r\n    function getHistoryBuffer(index) {\r\n        const bufferIndex = (state.currentOffset + index) % historyLength;\r\n        return diffHistory[bufferIndex];\r\n    }\r\n\r\n    function computeMovement(target, newFrame, oldFrame) {\r\n        for (let offset = 0; offset < newFrame.length; offset += 4) {\r\n            target[offset] = Math.abs(newFrame[offset] - oldFrame[offset]);\r\n            target[offset + 1] = Math.abs(newFrame[offset + 1] - oldFrame[offset + 1]); \r\n            target[offset + 2] = Math.abs(newFrame[offset + 2] - oldFrame[offset + 2]); \r\n            target[offset + 3] = 255;\r\n        }\r\n    }\r\n    \r\n    function computePersistance(buffer) {\r\n        let indexedHistoryBuffer = Array(historyLength);\r\n        for (let k = 0; k < historyLength; k++) {\r\n            indexedHistoryBuffer[k] = getHistoryBuffer(k);\r\n        }\r\n\r\n        for (let pixelOffset = 0; pixelOffset < buffer.length; pixelOffset++) {\r\n            buffer[pixelOffset] = 0;\r\n            buffer[pixelOffset + 1] = 0;\r\n            buffer[pixelOffset + 2] = 0;\r\n            buffer[pixelOffset + 3] = 255;\r\n            for (let historyBufferOffset = historyLength - 1; historyBufferOffset >= 0; historyBufferOffset--) {\r\n                const weight = state.persistanceFactor * (historyBufferOffset / historyLength);\r\n                const historyBuffer = indexedHistoryBuffer[historyBufferOffset];\r\n                buffer[pixelOffset] += weight * historyBuffer[pixelOffset];\r\n                buffer[pixelOffset + 1] += weight * historyBuffer[pixelOffset + 1];\r\n                buffer[pixelOffset + 2] += weight * historyBuffer[pixelOffset + 2];\r\n            }\r\n        }\r\n    }\r\n\r\n    function getValue(offset, currentBuffer) {\r\n        let lastValue = 0;\r\n        // warning : Uint8ClampedArray is not ... An Array (wtf Javascript ?)\r\n        // --> Don't use Array.isArray() with your instance, it will return false\r\n        if (window.lastBuffer instanceof Uint8ClampedArray) {\r\n            lastValue = window.lastBuffer[offset]\r\n        }\r\n\r\n\r\n        let value = Math.abs(currentBuffer[offset] - lastValue);\r\n\r\n        for (let i = historyLength - 1; i >= 0; --i) {\r\n            const weight = (window.persistance / historyLength) * i;\r\n            const historyBuffer = getHistoryBuffer(i);\r\n            value += weight * historyBuffer[offset];\r\n        }\r\n        \r\n        return Math.min(255, value);\r\n    }\r\n\r\n    const tutoCanvas =  document.getElementById('tuto-canvas');\r\n    const pixelBufferSize =  tutoCanvas.width * tutoCanvas.height * 4;\r\n    initializeHistory(diffHistory, historyLength, pixelBufferSize);\r\n\r\n    persistanceInput.addEventListener('change', () => {\r\n        window.persistance = persistanceInput.value;\r\n        state.persistanceFactor = window.persistance / historyLength;\r\n    });\r\n\r\n    \r\n    \r\n    historyInput.addEventListener('change', () => {\r\n        historyLength = historyInput.value;\r\n        diffHistory = Array(historyLength);\r\n        initializeHistory(diffHistory, historyLength, pixelBufferSize);\r\n        state.persistanceFactor = window.persistance / historyLength;\r\n    });\r\n\r\n\r\n    const bufferPool = new BufferPool(pixelBufferSize);\r\n\r\n    const animation = new _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n        canvas: tutoCanvas,\r\n        render: (context, canvas) => {\r\n            const fakeCanvas = document.createElement('canvas');\r\n            fakeCanvas.width =  canvas.width;\r\n            fakeCanvas.height = canvas.height;\r\n\r\n           \r\n            const fakeContext = fakeCanvas.getContext('2d');\r\n            fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height);\r\n\r\n            const fakeImageData = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);\r\n\r\n            applyGrayscaleFilter(fakeImageData.data);\r\n       \r\n            if (window.lastBuffer ===  null) {\r\n                lastBuffer = fakeImageData.data.slice(0);\r\n                window.lastBuffer = lastBuffer;\r\n                return;\r\n            }\r\n            \r\n\r\n            // const diffBuffer = new Uint8Array(buffer.length);\r\n            const diffBuffer = bufferPool.getOne();\r\n            const persistanceBuffer = bufferPool.getOne();\r\n            computeMovement(diffBuffer,  fakeImageData.data, window.lastBuffer);\r\n            computePersistance(persistanceBuffer);\r\n     \r\n            shallowCopy(lastBuffer, fakeImageData.data);\r\n\r\n            // step 5 - diff with persistance\r\n            for (let offset = 0; offset <   fakeImageData.data.length; offset += 4) {               \r\n                fakeImageData.data[offset] = Math.min(255, diffBuffer[offset] + persistanceBuffer[offset]);\r\n                fakeImageData.data[offset + 1] = Math.min(255, diffBuffer[offset + 1] + persistanceBuffer[offset + 1]);\r\n                fakeImageData.data[offset + 2] = Math.min(255, diffBuffer[offset + 2] + persistanceBuffer[offset + 2]);\r\n                fakeImageData.data[offset + 3] = 255;\r\n\r\n                // diffBuffer[offset] =  Math.abs(buffer[offset] - window.lastBuffer[offset]);\r\n                // diffBuffer[offset + 1] =  Math.abs(buffer[offset + 1] - window.lastBuffer[offset + 1]); \r\n                // diffBuffer[offset + 2] =  Math.abs(buffer[offset + 2] - window.lastBuffer[offset + 2]); \r\n                // diffBuffer[offset + 3] = 255;\r\n            }\r\n            \r\n          \r\n           \r\n            \r\n            let currentHistoryBuffer = diffHistory[state.currentOffset];\r\n            shallowCopy(currentHistoryBuffer, diffBuffer);\r\n\r\n            nbFrameRendered++;\r\n            state.currentOffset = nbFrameRendered % historyLength;\r\n\r\n      \r\n            bufferPool.recycle(diffBuffer);\r\n            bufferPool.recycle(persistanceBuffer);\r\n\r\n            animation.clear();\r\n            context.putImageData(fakeImageData, 0, 0);\r\n        }\r\n    });\r\n    \r\n    \r\n    video.addEventListener('play', () => {\r\n        animation.play();\r\n    });\r\n    \r\n    video.addEventListener('pause', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('end', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('timeupdate', () => {\r\n        if (animation.isPlaying === false) {\r\n            animation.askRendering();\r\n        }\r\n    })\r\n});\r\n\r\n\n\n//# sourceURL=webpack:///./src/step-5+.js?");

/***/ })

/******/ });