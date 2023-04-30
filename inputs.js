function keyDown(key) {
    if (!lastKey.includes(key.code)) {
        lastKeyTime[key.code] = 0;
        lastKey.push(key.code);
        gameTick(key.code)
    }
};


function keyUp (key) {
    if (lastKey.includes(key.code)) {
        lastKey.splice(lastKey.indexOf(key.code), 1);
    }
};


function gameTick(key) {
    let pressed = false;
    if (key == "KeyD") {
        move(certainTetrimo, MOVE_DIER.right)
        pressed = true;
    } else if (key == "KeyA") {
        move(certainTetrimo, MOVE_DIER.left)
        pressed = true;
    } else if (key == "KeyW") {
        while (move(certainTetrimo, MOVE_DIER.down));
        pressed = true;
        clearFullLines(certainTetrimo, true);
        newCertainTetrimo();
    } else if (key == "KeyS") {
        fallDown();
        pressed = true;
    } else if (key == "ArrowUp") {
        rotation(certainTetrimo, true)
        pressed = true;
    } else if (key == "ArrowDown") {
        rotation(certainTetrimo, false);
        pressed = true;
    } else if (key == "ShiftRight" || key == "ShiftLeft") {
        switchHold(true);
        pressed = true;
    } else if (key == "KeyK"){
        aiSwitchIntervall()
        pressed = true;
    }
    if (pressed) {
        preview(certainTetrimo);
    }
};


function holdKeyCheck(){
    lastKey.forEach(key =>{
        if(lastKeyTime[key] > 15){
            gameTick(key);
            lastKeyTime[key] = 13;
        } else lastKeyTime[key] ++;
        
    });
};


// -- falling Speed range funcitons ----
function fallingSpeedChange(){
    fallingSpeed = Number(document.getElementById("fallingSpeed").value)
    switchFalling();
    switchFalling();
};


function fallingSpeedChangeDisplay(){
    document.getElementById("fallingSpeedDisplay").innerHTML = "Falling speed: " + document.getElementById("fallingSpeed").value + " rows per second"
};
fallingSpeedChangeDisplay()


// -- AI Speed range functions ----
function aiSpeedChange(){
    aiSpeed = Number(document.getElementById("aiSpeed").value);
    aiSwitchIntervall();
    aiSwitchIntervall();
};

function aiSpeedChangeDisplay(){
    document.getElementById("aiSpeedDisplay").innerHTML = "AI speed: " + document.getElementById("aiSpeed").value + " moves per second"; 
};
aiSpeedChangeDisplay();


setInterval(holdKeyCheck, 1000 / 60);