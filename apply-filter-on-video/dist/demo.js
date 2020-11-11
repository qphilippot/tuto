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

/***/ "../shared/collision.helper.js":
/*!*************************************!*\
  !*** ../shared/collision.helper.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass CollisionHelper {\r\n    constructor() {}\r\n\r\n    /**\r\n     * from http://www.jeffreythompson.org/collision-detection/point-circle.php\r\n     * @param {Number} pointX \r\n     * @param {Number} pointY \r\n     * @param {Number} centerX \r\n     * @param {Number} centerY \r\n     * @param {Number} radius \r\n     * @return {Boolean}\r\n     */\r\n    isPointInCircle(pointX, pointY, centerX, centerY, radius) {\r\n        // get distance between the point and circle's center\r\n        // using the Pythagorean Theorem\r\n        const deltaX = pointX - centerX;\r\n        const deltaY = pointY - centerY;\r\n        const distance2 = (deltaX * deltaX) + (deltaY * deltaY);\r\n\r\n        // if the distance is less than the circle's\r\n        // radius the point is inside!\r\n        return (distance2 <= radius * radius);\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (new CollisionHelper());\n\n//# sourceURL=webpack:///../shared/collision.helper.js?");

/***/ }),

/***/ "../shared/geometry.helper.js":
/*!************************************!*\
  !*** ../shared/geometry.helper.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass GeometryHelper {\r\n    constructor() {}\r\n\r\n    /**\r\n     * from http://www.jeffreythompson.org/collision-detection/point-circle.php\r\n     * @param {Number} Ax \r\n     * @param {Number} Ay \r\n     * @param {Number} Bx \r\n     * @param {Number} By \r\n     * @return {Number}\r\n     */\r\n    getDistanceBetween2DPoints(Ax, Ay, Bx, By) {\r\n        // using the Pythagorean Theorem\r\n        const deltaX = Ax - Bx;\r\n        const deltaY = Ay - By;\r\n        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (new GeometryHelper());\n\n//# sourceURL=webpack:///../shared/geometry.helper.js?");

/***/ }),

/***/ "../shared/pointer-coords.helper.js":
/*!******************************************!*\
  !*** ../shared/pointer-coords.helper.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass PointerCoordsHelper {\r\n    constructor() {}\r\n\r\n    /**\r\n     * \r\n     * @param {Element} element \r\n     * @param {Number} x \r\n     * @param {Number} y \r\n     */\r\n    getCoordsRelativeToElement(element, x, y) {\r\n        const boundingBox = element.getBoundingClientRect();\r\n        \r\n        return {\r\n            x: x - boundingBox.left,\r\n            y: y - boundingBox.top\r\n        };\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (new PointerCoordsHelper());\n\n//# sourceURL=webpack:///../shared/pointer-coords.helper.js?");

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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/animation.model */ \"../shared/animation.model.js\");\n/* harmony import */ var image_processing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! image-processing */ \"./node_modules/image-processing/index.js\");\n/* harmony import */ var _shared_pointer_coords_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/pointer-coords.helper */ \"../shared/pointer-coords.helper.js\");\n/* harmony import */ var _shared_collision_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/collision.helper */ \"../shared/collision.helper.js\");\n/* harmony import */ var _shared_geometry_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/geometry.helper */ \"../shared/geometry.helper.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    const video = document.getElementById('tuto-video');\r\n    const pointerCoords = { x: 0, y: 0};\r\n\r\n    document.addEventListener('pointermove', event => {\r\n        pointerCoords.x = event.clientX;\r\n        pointerCoords.y = event.clientY;\r\n    });\r\n\r\n    /**\r\n     * step 1 - Apply filter to the whole buffer\r\n     * @param {Uint8Array} pixelBuffer \r\n     */\r\n    function applyGrayscaleFilter(pixelBuffer) {\r\n        for (let offset = 0; offset <pixelBuffer.length; offset += 4) {\r\n            const grayscale = image_processing__WEBPACK_IMPORTED_MODULE_1__[\"default\"].RGBToGrayscaleFilter.applyToPixel(pixelBuffer, offset);\r\n            pixelBuffer[offset] = grayscale;\r\n            pixelBuffer[offset + 1] = grayscale;\r\n            pixelBuffer[offset + 2] = grayscale;\r\n            pixelBuffer[offset + 3] = 255;\r\n        }\r\n    }\r\n\r\n    const animation = new _shared_animation_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n        canvas: document.getElementById('tuto-canvas'),\r\n        render: (context, canvas) => {\r\n            const fakeCanvas = document.createElement('canvas');\r\n            fakeCanvas.width =  canvas.width;\r\n            fakeCanvas.height = canvas.height;\r\n\r\n            const coordsRelativeToCanvas = _shared_pointer_coords_helper__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getCoordsRelativeToElement(\r\n                canvas,\r\n                pointerCoords.x,\r\n                pointerCoords.y\r\n            );\r\n\r\n           \r\n            const fakeContext = fakeCanvas.getContext('2d');\r\n            fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height);\r\n\r\n            const fakeImageData = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);\r\n            const buffer =  fakeImageData.data;\r\n\r\n            // step 2 - apply filter only if pointer is not over canvas \r\n            // const isPointerHoverCanvas = (\r\n            //     coordsRelativeToCanvas.x >= 0 &&\r\n            //     coordsRelativeToCanvas.y >= 0 &&\r\n            //     coordsRelativeToCanvas.x < canvas.width &&\r\n            //     coordsRelativeToCanvas.y < canvas.height \r\n            // );\r\n\r\n            \r\n            // if (isPointerHoverCanvas === false) {\r\n            //     applyGrayscaleFilter(buffer) ;\r\n            // }\r\n\r\n\r\n            // step 3 - apply to the whole buffer, execept a circle defined by pointer position\r\n            for (let offset = 0; offset < buffer.length; offset += 4) {\r\n                const pixelOffset = (offset / 4); // pixels have 4 channel in ImageData\r\n                const pixelX = pixelOffset % canvas.width;\r\n                const pixelY = pixelOffset / canvas.width;\r\n              \r\n                const radius = 80;\r\n\r\n                const isInCircle = _shared_collision_helper__WEBPACK_IMPORTED_MODULE_3__[\"default\"].isPointInCircle(\r\n                    pixelX, pixelY,\r\n                    coordsRelativeToCanvas.x, coordsRelativeToCanvas.y,\r\n                    radius\r\n                );\r\n\r\n                \r\n\r\n                if (isInCircle === false) {\r\n                    const grayscale = image_processing__WEBPACK_IMPORTED_MODULE_1__[\"default\"].RGBToGrayscaleFilter.applyToPixel(buffer, offset);\r\n                    // (step 3)\r\n                    buffer[offset] = grayscale;\r\n                    buffer[offset + 1] = grayscale;\r\n                    buffer[offset + 2] = grayscale;\r\n                    buffer[offset + 3] = 255;\r\n                }\r\n\r\n                else {\r\n                    // step 4 - apply a weigth to color\r\n                    const grayscale = image_processing__WEBPACK_IMPORTED_MODULE_1__[\"default\"].RGBToGrayscaleFilter.applyToPixel(buffer, offset);\r\n                    const distance =  _shared_geometry_helper__WEBPACK_IMPORTED_MODULE_4__[\"default\"].getDistanceBetween2DPoints(\r\n                        pixelX, pixelY,\r\n                        coordsRelativeToCanvas.x, coordsRelativeToCanvas.y\r\n                    );\r\n\r\n                    const weight = distance / radius;\r\n\r\n                    buffer[offset] = weight * grayscale + (1 - weight) * buffer[offset];\r\n                    buffer[offset + 1] = weight * grayscale + (1 - weight) * buffer[offset + 1];\r\n                    buffer[offset + 2] = weight * grayscale + (1 - weight) * buffer[offset + 2];\r\n                    buffer[offset + 3] = 255;\r\n                }\r\n            }\r\n          \r\n\r\n            animation.clear();\r\n            context.putImageData(fakeImageData, 0, 0);\r\n        }\r\n    });\r\n    \r\n    video.addEventListener('play', () => {\r\n        animation.play();\r\n    });\r\n    \r\n    video.addEventListener('pause', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('end', () => {\r\n        animation.pause();\r\n    });\r\n    \r\n    video.addEventListener('timeupdate', () => {\r\n        animation.askRendering()\r\n    })\r\n});\r\n\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });