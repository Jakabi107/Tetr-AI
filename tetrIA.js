let aiIntervall;
let aiSwitch = true;

function aiSwitchIntervall () {
    if (aiSwitch){
        aiIntervall = setInterval (makeMove, 1000/aiSpeed);
    } else {
        clearInterval(aiIntervall)
    }
    aiSwitch = !aiSwitch;
};

function makeMove(){
    let main = loopAllPos();
    switchHold(false);
    let hold = loopAllPos();

    if (main.points < hold.points) {
        switchHold(false);
        model = main.model;
        points += POINTS[main.lines]
    } else {
        model = hold.model
        points += POINTS[hold.lines]
    }

    newCertainTetrimo();
}

function loopAllPos() {
    let best  = {points:undefined, model:undefined, lines:undefined};

    let firstMove = [];

    for (let i = 0; i < 4; i++) {
        let bigBack = JSON.parse(JSON.stringify(model));
        let bigBackTetrCoord = certainTetrimo.coordinates
        while (move(certainTetrimo, MOVE_DIER.left));

        let morePosAvailable = true;
        let first = true;

        while (morePosAvailable) {

            let back = JSON.parse(JSON.stringify(model));
            let backTetrCoord = certainTetrimo.coordinates;
            while (move(certainTetrimo, MOVE_DIER.down));

            if (first) {
                if (firstMove.includes(JSON.stringify(model))) break; 
                firstMove[firstMove.length] = JSON.stringify(model);
                first = false;
            }
            //handle so it doesn't take all rotation for their one

            let lines = clearFullLines(certainTetrimo);

            let score = calculateScore(model, lines);

            if(!(score >= best.points)){
                best.points = score;
                best.model = JSON.parse(JSON.stringify(model));
                best.lines = lines
            }
            // -- calculate points --

            model = back;
            certainTetrimo.coordinates = backTetrCoord;
            morePosAvailable = move(certainTetrimo, MOVE_DIER.right);
        }
        model = JSON.parse(JSON.stringify(bigBack));
        certainTetrimo.coordinates = bigBackTetrCoord;
        move(certainTetrimo, MOVE_DIER.down);
        rotation(certainTetrimo, true);
        move(certainTetrimo, MOVE_DIER.up);
    }
    return best;
};

//certainRotation = spinRight(tetrimo, certainRotation)
//move down - move(certainTetrimo, MOVE_DIER.down)
//move(certainTetrimo, MOVE_DIER.left)
//getting all posible Positions

function calculateScore(modelSnapshot, lines){
    let height;
    let holes = 0;
    let cliff = 0;
    modelSnapshot.forEach((element, y) => {
        element.forEach((element, x) => {
            if (element > 0){
                if (!height) height = 20 - y;  
                holes += detectHole(modelSnapshot, y,x);
                cliff += detectCliff(modelSnapshot,y,x + 1) + detectCliff(modelSnapshot,y,x -1);
            }
        })
    });

    let gameOver = 0;
    if (height > 18) {
        for(let j = 0; j < 2; j++){
            for(let i = 0; i < 4; i++){
                if(model[j][i + 3]) gameOver = 1;
            };
        };
    };

    let minClear = 4 - lines
    let score = height * 0.4 + holes * 8 + cliff * 1.5 + minClear * 0.1 + gameOver * 18283375748390;
    return score;
} 

function detectHole (modelSnapshot,y,x){
    return (modelSnapshot[y+1] != undefined && modelSnapshot[y+1][x] == 0)
}

function detectCliff (modelSnapshot,y,x){
    let oldY = y;
    while(modelSnapshot[y] != undefined && modelSnapshot[y][x] == 0 && oldY - y != -3) y ++;
    return (oldY - y == -3);
}
