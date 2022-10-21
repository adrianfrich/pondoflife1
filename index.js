const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


const resolution = 5;
canvas.width = 460;
canvas.height = 140;

var text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.fontFamily = 'Courier New';
text2.style.width = 80;
text2.style.height = 80;
text2.innerHTML = "hi there, click on the pool to play with the tadpoles <br> <br> <b>preferably viewed maximized window";
text2.style.top = 20 + 'px';
text2.style.left = 20 + 'px';
document.body.appendChild(text2);


const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

//
class Cell {
    constructor() {
        this.currentstate = Math.floor(Math.random() * 2);
        this.total = 0;
    }
    setState(state) {
        this.currentstate = state;
        this.total +- state;
    }
}

function buildGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
            .map(() => new Cell()));
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
    grid = nextGen(grid);
    render(grid);
    requestAnimationFrame(update);
}
//all the rules need to be updated for the next generation. It's going to loop through
//an array, this is an array of an array. That's what the spread operator is doing.
function nextGen(grid) {
    // const nextGen = grid.map(arr => [...arr]);
    const currentGen = grid.map(arr => arr.map(cell => cell.currentstate));

    for (let col = 0; col < currentGen.length; col++) {
        for (let row = 0; row < currentGen[col].length; row++) {
            const cell = currentGen[col][row];
            let numNeighbours = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) {
                        continue;
//looping through the grid and finding each cell. By using the -1 in the row and column
//direction, we are able to reiterate and loop through each of a cell's neighbouring cell.
                    }
                    const x_cell = col + i;
                    const y_cell = row + j;

                    if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
                        const currentNeighbour = currentGen[col + i][row + j];
                        numNeighbours += currentNeighbour;
                    }
                }
            }

            //rules
            if (cell === 1 && numNeighbours < 2) { 
                //if the current cell is still alive, and the current neighbours is less than two, we die
                grid[col][row].setState(0);
            } else if (cell === 1 && numNeighbours > 3) { 
                //if the current cell is alive, and there are more than three neighbours, we die
                grid[col][row].setState(0);
            } else if (cell === 0 && numNeighbours === 3) { 
                //if the current cell is dead, but there are three neighbours, we come to life or stay the same.
                grid[col][row].setState(1);
            } else {
                grid[col][row].setState(grid[col][row].currentstate);
            }
        }
    }
    return grid;
}


// console.log(grid);
function render (grid) {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];

            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell.currentstate ? '#696969' : '#8eddff' ;
            // ctx.fillStyle = 'hsl(${cell.total % 360},+, 100%, 50%)';
            ctx.fill();
            // ctx.strokeStyle = "#ccebff";
            // ctx.stroke();
        }
    }
}

