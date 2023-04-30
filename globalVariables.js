let points = 0;
let model = Array(20).fill().map(() => (Array(10).fill(0)));
let holdModel = Array(4).fill().map(() => (Array(4).fill(0)));
let fallingSpeed = 3;


// -- Points Data ----
const POINTS = {
    0:0,
    1:40,
    2:100,
    3:300,
    4:1200
}

// -- Tetrimo Data ------
const FORM_COLOR = ["I","J","L","O","S","T","Z"]; //index of + 1
const COLORS = ["#00ffff", "#0000ff", "#ff7f00", "#ffff00", "#00ff00", "#800080", "#ff0000"];

const FORMS = {
    I: [new flatVector(3, 0), new flatVector(4, 0), new flatVector(5, 0), new flatVector(6, 0)],
    J: [new flatVector(4, 0), new flatVector(4, 1), new flatVector(5, 1), new flatVector(6, 1)],
    L: [new flatVector(5, 0), new flatVector(3, 1), new flatVector(4, 1), new flatVector(5, 1)],
    O: [new flatVector(4, 0), new flatVector(5, 0), new flatVector(4, 1), new flatVector(5, 1)],
    S: [new flatVector(4, 0), new flatVector(5, 0), new flatVector(3, 1), new flatVector(4, 1)],
    T: [new flatVector(4, 0), new flatVector(3, 1), new flatVector(4, 1), new flatVector(5, 1)],
    Z: [new flatVector(3, 0), new flatVector(4, 0), new flatVector(4, 1), new flatVector(5, 1)]
};

const FORMS_DESIGN_STATIC ={
    I: [new flatVector(0, 1.5), new flatVector(1, 1.5), new flatVector(2, 1.5), new flatVector(3, 1.5)],
    J: [new flatVector(0.5, 1), new flatVector(0.5, 2), new flatVector(1.5, 2), new flatVector(2.5, 2)],
    L: [new flatVector(2.5, 1), new flatVector(0.5, 2), new flatVector(1.5, 2), new flatVector(2.5, 2)],
    O: [new flatVector(1, 1), new flatVector(2, 1), new flatVector(1, 2), new flatVector(2, 2)],
    S: [new flatVector(1.5, 1), new flatVector(2.5, 1), new flatVector(0.5, 2), new flatVector(1.5, 2)],
    T: [new flatVector(1.5, 1), new flatVector(0.5, 2), new flatVector(1.5, 2), new flatVector(2.5, 2)],
    Z: [new flatVector(0.5, 1), new flatVector(1.5, 1), new flatVector(1.5, 2), new flatVector(2.5, 2)]
}

const SPIN_FORM_VECTORS = {
    I: [
        [new flatVector(2, -1), new flatVector(1, 0), new flatVector(0, 1), new flatVector(-1, 2)],
        [new flatVector(-2, 2), new flatVector(-1, 1), new flatVector(0, 0), new flatVector(1, -1)],
        [new flatVector(1, -2), new flatVector(0, -1), new flatVector(-1, 0), new flatVector(-2, 1)],
        [new flatVector(-1, 1), new flatVector(0, 0), new flatVector(1, -1), new flatVector(2, -2)]
    ],
    J: [
        [new flatVector(1, 0), new flatVector(2, -1), new flatVector(0, 0), new flatVector(-1, 1)],
        [new flatVector(-1, 1), new flatVector(-1, 1), new flatVector(1, 0), new flatVector(1, 0)],
        [new flatVector(1, -1), new flatVector(0, 0), new flatVector(-2, 1), new flatVector(-1, 0)],
        [new flatVector(-1, 0), new flatVector(-1, 0), new flatVector(1, -1), new flatVector(1, -1)]
    ],
    L: [
        [new flatVector(-1, 0), new flatVector(1, 0), new flatVector(0, 1), new flatVector(0, 1)],
        [new flatVector(-1, 1), new flatVector(0, 0), new flatVector(1, -1), new flatVector(-2, 0)],
        [new flatVector(0, -1), new flatVector(0, -1), new flatVector(-1, 0), new flatVector(1, 0)],
        [new flatVector(2, 0), new flatVector(-1, 1), new flatVector(0, 0), new flatVector(1, -1)]
    ],
    O: [
        [new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0)],
        [new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0)],
        [new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0)],
        [new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0)]
    ],
    S: [
        [new flatVector(0, 0), new flatVector(-1, 1), new flatVector(2, 0), new flatVector(1, 1)],
        [new flatVector(0, 1), new flatVector(1, 0), new flatVector(-2, 1), new flatVector(-1, 0)],
        [new flatVector(-1, -1), new flatVector(-2, 0), new flatVector(1, -1), new flatVector(0, 0)],
        [new flatVector(1, 0), new flatVector(2, -1), new flatVector(-1, 0), new flatVector(0, -1)]
    ],
    T: [
        [new flatVector(0, 0), new flatVector(1, 1), new flatVector(0, 0), new flatVector(0, 0)],
        [new flatVector(-1, 1), new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0)],
        [new flatVector(0, 0), new flatVector(0, 0), new flatVector(0, 0), new flatVector(-1, -1)],
        [new flatVector(1, -1), new flatVector(-1, -1), new flatVector(0, 0), new flatVector(1, 1)]
    ],
    Z: [
        [new flatVector(2, 0), new flatVector(0, 1), new flatVector(1, 0), new flatVector(-1, 1)],
        [new flatVector(-2, 1), new flatVector(0, 0), new flatVector(-1, 1), new flatVector(1, 0)],
        [new flatVector(1, -1), new flatVector(-1, 0), new flatVector(0, -1), new flatVector(-2, 0)],
        [new flatVector(-1, 0), new flatVector(1, -1), new flatVector(0, 0), new flatVector(2, -1)]
    ]
};

//can't spell it... :) 
class teriomio {
    coordinates = Array();
    name = String();
    color = Number();
    constructor(piece) {
        this.name = piece;
        this.coordinates = FORMS[piece];
        this.color = FORM_COLOR.indexOf(piece) + 1;
    };
};



// -- Algorithem ------
let certainRotation = 0;
let certainTetrimo;
let currentHold = undefined;
let holdable = true;


// -- AI -----
let aiSpeed = 60;


// -- Key Press -----
let lastKeyTime = {}
let lastKey = [];