
function applyToModel(tetrimo, value) {
    tetrimo.coordinates.forEach(element => {
        model[element.y][element.x] = value;
    });
};

// -- MOVEMENT ------

// - Move -
const MOVE_DIER = {
    down: new flatVector(0, 1),
    up: new flatVector(0, -1),
    left: new flatVector(-1, 0),
    right: new flatVector(1, 0)
};


function moveByVector(tetrimo, vector) {
    tetrimo.coordinates = tetrimo.coordinates.map(element => element.addition(vector));
};


// true if it can move
function move(tetrimo, vector, apply = true) {
    let result = true;
    applyToModel(tetrimo, 0);
    moveByVector(tetrimo, vector);
    if (checkIfCollapse(tetrimo)) {
        moveByVector(tetrimo, new flatVector(0,0).subtraction(vector));
        result = false;
    };
    if (apply) applyToModel(tetrimo, tetrimo.color);
    return result;
};


// true if collapse
function checkIfCollapse(tetrimo) {
    let result = false;
    tetrimo.coordinates.forEach(element => {
        if (model[element.y] == undefined || model[element.y][element.x] == undefined || model[element.y][element.x] > 0) {
            result = true;
        };
    });
    return result;
}


// - rotation -
function spin(tetrimo, rotation, right) {
    if (!right) rotation == 0? rotation = 3 : rotation = rotation -1;
    tetrimo.coordinates = tetrimo.coordinates.map((element, index) => {
        return element.addition(right? SPIN_FORM_VECTORS[tetrimo.name][rotation][index] : SPIN_FORM_VECTORS[tetrimo.name][rotation][index].invert());
    });
    if (right) return rotation == 3 ? 0 : rotation + 1;
    return rotation;
};


function rotation(tetrimo, right) {
    let result = true
    applyToModel(tetrimo, 0);
    certainRotation = spin(tetrimo, certainRotation, right);
    if (checkIfCollapse(tetrimo)) {
        certainRotation = spin(tetrimo, certainRotation, !right);
        result = false;
    }
    applyToModel(tetrimo, tetrimo.color);
    return result;
}


// -- Hold ----
function switchHold(player) {
    if (holdable) {
        applyToModel(certainTetrimo, 0);
        let back = currentHold;
        currentHold = certainTetrimo.name;
        if (back) {
            certainTetrimo = new teriomio(back);
            certainRotation = 0;
        } else newCertainTetrimo();
        applyToModel(certainTetrimo, certainTetrimo.color)
        renderOnePeace(currentHold, holdCtx, 0,0,32);
        timer = 0;
        if (player) holdable = false;
    };
};


// -- clear Lines ----
function clearLine(line) {
    for (let i = line; i > 0; i--) {
        model[i] = JSON.parse(JSON.stringify(model[i - 1]))
    }
    model[0] = Array(model[0].length).fill(0);
};


function clearFullLines(tetrimo, addToBoard) {
    let clears = 0;
    let lines = [];
    tetrimo.coordinates.forEach(element => {
        if (!lines.includes(element.y)) lines.push(element.y);
    });
    lines.sort((a, b) => a - b).forEach(line => {
        if (!model[line].includes(0)) {
            clearLine(line);
            clears ++;
        }
    });
    if(addToBoard) points += POINTS[clears];
    //lines += lines.length;
    return clears;
}
//clearLine


// -- insert new tetrimo ----
const FORMS_LETTER = "IJLOSTZ"
let certainFormsLetter = FORMS_LETTER;

let following = "";

function newLetter(){
    while (following.length < 7){
        let letter = certainFormsLetter[Math.floor(Math.random() * certainFormsLetter.length)];
        certainFormsLetter = certainFormsLetter.replace(letter, "");
        if (certainFormsLetter.length == 0) certainFormsLetter = FORMS_LETTER;
        
        following += letter;
    };
    let letter = following[0]
    following =  following.replace(letter, "");
    return letter;
};

function newCertainTetrimo() {
    let letter = newLetter()
    certainTetrimo = new teriomio(letter);
    certainRotation = 0;
    holdable = true;
    renderNextPeaces()

    if(gameOverCheck(certainTetrimo)) gameOver();

    applyToModel(certainTetrimo, certainTetrimo.color)
};
newCertainTetrimo();


// -- game Over ----
function gameOver(){
    alert("GAME OVER - points: " + points);
    resetGame();
}


function gameOverCheck (tetrimo){
    let check = false;
    tetrimo.coordinates.forEach(element => {
        if (model[element.y][element.x] > 0) check = true
    });
    return check;
}


function resetGame () {
    currentHold = undefined;
    model = Array(20).fill().map(() => (Array(10).fill(0)));
    certainFormsLetter = FORMS_LETTER;
    points = 0;
    newCertainTetrimo();
}


// -- preview of the next turn ----
function preview (tetrimo){
    let future = new teriomio (tetrimo.name);
    future.coordinates = tetrimo.coordinates.map(element=>{
        return new flatVector(element.x, element.y);
    });
    while(move(future, MOVE_DIER.down, false));
    applyToModel(tetrimo, tetrimo.color);

    previewVisualise(future);
    return future;
}


// -- Fall Down ----
let timer = 0;
function fallDown() {
    if (!move(certainTetrimo, MOVE_DIER.down)) {
        timer++;
        if (timer > 6) {
            clearFullLines(certainTetrimo, true);
            newCertainTetrimo();
            timer = 0
        }
    }
}

let fallingIntervall;
let fallingSwitch = true;

function switchFalling(){
    if (fallingSwitch){
        fallingIntervall = setInterval(fallDown, 1000/fallingSpeed);
    } 
    else {
        clearInterval(fallingIntervall);
    }
    fallingSwitch = !fallingSwitch;
};