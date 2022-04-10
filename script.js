const q = (tag) => document.querySelector(tag);

/** @type {HTMLCanvasElement}*/
const canvas = q('#canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const c = canvas.getContext("2d");

class Cell{
    constructor(x,y, isAlive = true){
        this.x = x ; 
        this.y = y ;
        this.width = 10;
        this.alive = isAlive;
    }
    draw(){
        if (!this.alive) return;
        c.fillStyle = "yellow";
        c.fillRect(this.x, this.y, this.width, this.width)
    }
    kill(){
        this.alive = false;
    }
    rebirth(){
        this.alive = true;
    }
    copy(){
        return new Cell(this.x, this.y, this.alive);
    }



    
}

/** @type {Cell[]}*/
let boxes = [];



/**
 * 
 * @param {String} text - text to add
 * @param {Number} font Font Size
 * @param {"middle" | "left" | "right"} position 
 */
function addText(text, font = 24, position){
    
    c.fillStyle = "white"
    c.font = font + "px Arial";

    c.textBaseline = "top";
    switch (position) {
        
        case "left":
            c.textAlign = "left";
            
            c.fillText(text, 10, 10);
            break;
        case "middle":
            c.textAlign = "center";
            c.fillText(text, canvas.width / 2, 30);
            break;
        case "right":
            c.textAlign = "right";
            c.fillText(text, canvas.width - 30, 30);
            break;
        default:
            break;
        
    }

    
}



function addDeadCells(params) {
    for (let i = 0; i < canvas.width; i+=10){
        for (let j = 0; j < canvas.height; j+=10){
            boxes.push(
                new Cell(i, j, false)
            )
        }
    }
}

function drawGrid() {
    for (let i = 0; i < canvas.width; i+=10){
        for (let j = 0; j < canvas.height; j+=10){
            c.beginPath();
            c.moveTo(i, j);
            c.lineTo(i + 10, j);
            c.stroke();

            c.beginPath();
            c.moveTo(i, j);
            c.lineTo(i, j+ 10);
            c.stroke();
        }
    }
}




let hasGameStarted = false;

let frames = 0;

function getCopy(arr){
    let newArr = [];
    arr.forEach(item => newArr.push(item));
    return newArr;
}

function animate(){
    c.clearRect(0,0,canvas.width, canvas.height);
    drawGrid();
    addText("Game Of Life", 50, "middle")
    boxes.forEach(box => {
        box.draw();
    })


    if (hasGameStarted){
        if (frames % 10 == 0){

            let changedBoxes = [];
            
            let i = 0;
            boxes.forEach(box => {
                changedBoxes.push(box.copy())
                // let revisedBoxes = [...boxes];
                
                const possibleNeighbors = boxes
                    .filter(neighbor => neighbor.alive)
                    // {x: 0, y: 10}
                    // {x:0, y: 10} {x:0, y:10}
                    .filter(neighbor =>  !((box.x == neighbor.x) && (box.y == neighbor.y)))
                    .filter(cell => (Math.abs(box.x - cell.x) <= 10) && (Math.abs(box.y - cell.y) <= 10));
                
                // if (box.alive) console.log(possibleNeighbors);
                const liveNeighbors = possibleNeighbors.length;
                // if (box.alive)console.log(JSON.parse(JSON.stringify(box)));
                // console.log(JSON.parse(JSON.stringify(possibleNeighbors)));

                

                if (box.alive){
                    if (liveNeighbors < 2){
                        console.log("KILL");
                        
                        changedBoxes[i].kill()
                    } 
                    else if (liveNeighbors == 2 || liveNeighbors == 3){
                        
                        // lives on
                    }
                    else 
                    {
                        changedBoxes[i].kill()
                    }
                }
                else {
                    if (liveNeighbors === 3){
                        console.log("REBIRTH")
                        changedBoxes[i].rebirth();
                    }
                }
                
                i++;
            })
            boxes = changedBoxes;

        }
    }


    frames++;


    requestAnimationFrame(animate)
}

q('.start-btn').addEventListener("click", () => {
    hasGameStarted = true;
})
/**
 * 
 * @param {PointerEvent} e 
 */
function click(e) {
    const xPos = Math.floor(e.x  / 10) * 10;
    const yPos = Math.floor(e.y  / 10) * 10;

    const newBoxes = [...boxes];
    
    const idx = newBoxes.findIndex(box => box.x === xPos && box.y == yPos);
    newBoxes[
        newBoxes.findIndex(box => box.x === xPos && box.y == yPos)
    ] = new Cell(xPos, yPos, true);
    boxes = newBoxes;

}

canvas.addEventListener('click', click)
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})



addDeadCells();
animate()
