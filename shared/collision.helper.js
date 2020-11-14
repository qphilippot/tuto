class CollisionHelper {
    constructor() {}

    /**
     * from http://www.jeffreythompson.org/collision-detection/point-circle.php
     * @param {Number} pointX 
     * @param {Number} pointY 
     * @param {Number} centerX 
     * @param {Number} centerY 
     * @param {Number} radius 
     * @return {Boolean}
     */
    isPointInCircle(pointX, pointY, centerX, centerY, radius) {
        // get distance between the point and circle's center
        // using the Pythagorean Theorem
        const deltaX = pointX - centerX;
        const deltaY = pointY - centerY;
        const distance2 = (deltaX * deltaX) + (deltaY * deltaY);

        // if the distance is less than the circle's
        // radius the point is inside!
        return (distance2 <= radius * radius);
    }
}

export default new CollisionHelper();