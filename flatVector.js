class flatVector {
    addition = function (secondVector) {
        return new flatVector(this.x + secondVector.x, this.y + secondVector.y);
    };

    subtraction = function (secondVector) {
        return new flatVector(this.x - secondVector.x, this.y - secondVector.y);
    };

    invert = function () {
        return new flatVector(-this.x, -this.y);
    };

    constructor(x,y){
        this.x = x;
        this.y = y;
    };
}