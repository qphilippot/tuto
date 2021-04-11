class PointerCoordsHelper {
    constructor() {}

    /**
     * 
     * @param {Element} element 
     * @param {Number} x 
     * @param {Number} y 
     */
    getCoordsRelativeToElement(element, x, y) {
        const boundingBox = element.getBoundingClientRect();

        return {
            x: x - boundingBox.left,
            y: y - boundingBox.top
        };
    }
}

export default new PointerCoordsHelper();