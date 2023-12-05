/* Grid Builder */
const gridContainer = document.getElementById('grid');
const rows = 20;
const columns = 30;
const nodes = [];

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
        const cell = document.createElement('div');
        cell.classList.add('gridCell');
        cell.id = `x${j}y${i}`;
        gridContainer.appendChild(cell);

        const node = {
            x: j,
            y: i,
            status: 'empty',
            gCost: 0,
            hCost: 0,
            parent: {}
        }
        nodes.push(node);
    }
}

let selectedStatus = ''; // To store the currently selected status

// Function to handle button clicks
function handleButtonClick(status) {
    selectedStatus = status;
}

let startSet = false; // Track if start node is set
let endSet = false; // Track if end node is set
let startNode = null; // Store reference to the start node
let endNode = null; // Store reference to the end node

function clearNode(node) {
    if (node) {
        node.status = 'empty';
        const cell = document.getElementById(`x${node.x}y${node.y}`);
        cell.style.backgroundColor = ''; // Reset cell color
    }
}

// Function to handle cell clicks
function handleCellClick(event) {
    const cellId = event.target.id;
    const [xStr, yStr] = cellId.substring(1).split('y');
    const x = parseInt(xStr);
    const y = parseInt(yStr);

    const cell = nodes.find(node => node.x === x && node.y === y);

    if (cell) {
        if (selectedStatus === 'start') {
            if (startSet) {
                clearNode(startNode);
            }
            startNode = cell;
            startSet = true;
            cell.status = 'start';
            event.target.style.backgroundColor = 'green';
        } else if (selectedStatus === 'end') {
            if (endSet) {
                clearNode(endNode);
            }
            endNode = cell;
            endSet = true;
            cell.status = 'end';
            event.target.style.backgroundColor = 'red';
            
        } else if (selectedStatus === 'block') {
            if (cell.status === 'block') {
                cell.status = 'empty'; // Toggle from block to empty
                event.target.style.backgroundColor = ''; // Reset cell color
            } else if (cell.status !== 'start' && cell.status !== 'end') {
                cell.status = 'block'; // Set as block if not start/end
                event.target.style.backgroundColor = 'black';
            }
        }
    }
}

let isMouseDown = false; // Flag to track mouse button state

// Function to handle continuous block painting
function handleContinuousBlockPaint(event) {
    if (isMouseDown) {
        const cellId = event.target.id;
        const [xStr, yStr] = cellId.substring(1).split('y');
        const x = parseInt(xStr);
        const y = parseInt(yStr);

        const cell = nodes.find(node => node.x === x && node.y === y);

        if (cell && selectedStatus === 'block') {
            if (cell.status === 'block') {
                cell.status = 'empty'; // Toggle from block to empty
                event.target.style.backgroundColor = ''; // Reset cell color
            } else if (cell.status !== 'start' && cell.status !== 'end') {
                cell.status = 'block'; // Set as block if not start/end
                event.target.style.backgroundColor = 'black';
            }
        }
    }
}

function resetNodes() {
    nodes.forEach(node => {
        clearNode(node);
    });

    // Reset start and end nodes flags and references
    startSet = false;
    endSet = false;
    startNode = null;
    endNode = null;
}

// Attach click event listeners to buttons
document.getElementById('buttonStart').addEventListener('click', () => handleButtonClick('start'));
document.getElementById('buttonEnd').addEventListener('click', () => handleButtonClick('end'));
document.getElementById('buttonBlock').addEventListener('click', () => handleButtonClick('block'));
document.getElementById('buttonReset').addEventListener('click', resetNodes);

// Attach click event listener to grid cells
const gridCells = document.querySelectorAll('.gridCell');
gridCells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Event listener for continuous block painting
gridContainer.addEventListener('mousedown', () => {
    isMouseDown = true;
    gridContainer.addEventListener('mouseover', handleContinuousBlockPaint);
});

// Event listener to stop continuous painting
document.addEventListener('mouseup', () => {
    isMouseDown = false;
    gridContainer.removeEventListener('mouseover', handleContinuousBlockPaint);
});

/*  
function heuristic(nodeA, nodeB) {
    const dx = Math.abs(nodeA.x - nodeB.x);
    const dy = Math.abs(nodeA.y - nodeB.y);
    return Math.sqrt(dx * dx + dy * dy); 
}

function AStar(startNode, goalNode) {
    let openList = [startNode];
    let closedList = [];

    while (openList.length > 0) {
        // Find node with lowest fCost in openList
        const currentNode =  Find node with lowest fCost ;

        // Move currentNode from openList to closedList
        // ...

        // If currentNode is the goal, reconstruct path and exit loop
        if ( currentNode is goal ) {
            return  Reconstruct path ;
        }

        // Process neighboring nodes
        for (const neighbor of  currentNode's neighbors ) {
            if ( neighbor is not walkable or in closedList ) {
                continue;
            }

            const tentativeGCost =  Calculate tentative gCost ;

            if ( neighbor not in openList or tentativeGCost is lower ) {
                // Update neighbor's gCost, hCost, parent
                // Add neighbor to openList
            }
        }
    }

    // No path found
    return null;
}

*/
/* End the grid builder */