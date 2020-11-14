class GeometryHelper {
    constructor() {}

    /**
     * from http://www.jeffreythompson.org/collision-detection/point-circle.php
     * @param {Number} Ax 
     * @param {Number} Ay 
     * @param {Number} Bx 
     * @param {Number} By 
     * @return {Number}
     */
    getDistanceBetween2DPoints(Ax, Ay, Bx, By) {
        // using the Pythagorean Theorem
        const deltaX = Ax - Bx;
        const deltaY = Ay - By;
        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }
}

export default new GeometryHelper();