let myCanvas = document.createElement("canvas");
//just for auto completion

myCanvas = document.getElementById("tableCan");
let ctx = myCanvas.getContext("2d")
//canvas setup


function generateSquareOutline (x, y, width, height, innerColor, outlineColor, thickness, context = ctx) {
    context.save();

    context.fillStyle = outlineColor;
    context.fillRect(x, y, width, height);

    context.fillStyle = innerColor;
    context.fillRect(x + thickness, y + thickness, width - 2*thickness, height - 2*thickness);

    context.restore()
}


// -- main model -----
let modelClone = Array(20).fill().map(() => (Array(10).fill(10)));
let oldPoints = points;

function updateGraphik() {
    
    if (JSON.stringify(model) != JSON.stringify(modelClone)) {
        model.forEach((element, y) => {
            element.forEach((element, x) => {
                if (model[y][x] != modelClone[y][x]) {
                    if (element > 0) {
                        generateSquareOutline(x * 32, y * 32, 32, 32, COLORS[element - 1], "black", 1)
                    }
                    else {
                        ctx.fillStyle = "#7f7f7f"
                        ctx.fillRect(x * 32, y * 32, 32, 32);
                    }
                }
            });
        });
        modelClone = JSON.parse(JSON.stringify(model));
    }
    // - update mainTable -
    if (oldPoints != points) {
        document.getElementById("pointsArea").innerHTML = points;
        oldPoints = points;
    }
    //update Points

};


// -- Hold Canvas ----
let myCanvasHold = document.createElement("canvas");
myCanvasHold = document.getElementById("holdCan");

let holdCtx = myCanvasHold.getContext("2d");

holdCtx.fillStyle = "#7f7f7f";
holdCtx.fillRect(0,0,128,128)

//--  ------
function renderOnePeace(pieceLetter, context, posX, posY, size){
    let coordinates =FORMS_DESIGN_STATIC[pieceLetter];

    context.fillStyle = "#7f7f7f";
    context.fillRect(posX, posY, size * 4, size * 4);
    coordinates.forEach(element =>{
        generateSquareOutline(element.x * size + posX, element.y * size + posY, size, size, COLORS[FORM_COLOR.indexOf(pieceLetter)], "black", 1, context);
    });
};


//-- render Next Pieces -----
let nextCanvas = document.createElement("canvas");
nextCanvas = document.getElementById("nextCan");
let nextCtx = nextCanvas.getContext("2d");

nextCtx.fillStyle = "black"
for(let i = 1; i < 3; i++) nextCtx.fillRect(0,i*131-3, 128,3);

function renderNextPeaces(){
    for(let i = 0; i < 3; i++){
        let pieceLetter = following[i];
        renderOnePeace(pieceLetter, nextCtx, 0, 131*i,32);
    };
};


// -- future pos ----
let previewVisualisedTetrimo;
function previewVisualise (tetrimo) {
    if (previewVisualisedTetrimo) {
        previewVisualisedTetrimo.coordinates.forEach(element => {
            if (model[element.y][element.x] == 0){
                ctx.fillStyle = "#7f7f7f";
                ctx.fillRect(element.x * 32, element.y * 32, 32, 32)
            }
        });
    };
    previewVisualisedTetrimo = tetrimo;
    tetrimo.coordinates.forEach(element=>{
        if (model[element.y][element.x] == 0) generateSquareOutline(element.x * 32, element.y * 32, 32, 32, "#7f7f7f", COLORS[tetrimo.color -1], 1);
    });
}


// -- Intervall for main graphic
setInterval(updateGraphik, 1000 / 60)