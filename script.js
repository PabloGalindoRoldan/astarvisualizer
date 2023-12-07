
//I start by building a Grid
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

        //Each grid cell has a node asociated with it
        const node = {
            x: j,
            y: i,
            status: 'empty',
            gCost: Infinity,
            hCost: 0,
            parent: null,
        }
        nodes.push(node);
    }
}

//I define variables to track the users input.

let startSet = false; // Track if start node is set
let endSet = false; // Track if end node is set
let startNode = null; // Store reference to the start node
let endNode = null; // Store reference to the end node
let selectedStatus = ''; // I define this variable to store the currently selected status through the tools buttons

// This function changes the selectedStatus variable, according to what user clicked
function handleButtonClick(status) {
    selectedStatus = status;
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
            event.target.style.backgroundColor = '#eeaf61'; //This will change the backgcolor of the start cell and will handle the case for when you change it
        } else if (selectedStatus === 'end') {
            if (endSet) {
                clearNode(endNode);
            }
            endNode = cell;
            endSet = true;
            cell.status = 'end';
            event.target.style.backgroundColor = '#89084b'; //This will change the backgcolor of the end cell and will handle the case for when you change it
            
        } else if (selectedStatus === 'block') {
            if (cell.status === 'block') {
                cell.status = 'empty'; // Toggle from block to empty
                event.target.style.backgroundColor = ''; // Reset cell color
            } else if (cell.status !== 'start' && cell.status !== 'end') {
                cell.status = 'block'; // Set as block if not start/end
                event.target.style.backgroundColor = '#6a0d83';
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
                event.target.style.backgroundColor = '#6a0d83';
            }
        }
    }
}

// Attach click event listeners to buttons
document.getElementById('buttonStart').addEventListener('click', () => handleButtonClick('start'));
document.getElementById('buttonEnd').addEventListener('click', () => handleButtonClick('end'));
document.getElementById('buttonBlock').addEventListener('click', () => handleButtonClick('block'));
document.getElementById('buttonReset').addEventListener('click', resetNodes);
document.getElementById('buttonVisualizer'). addEventListener('click', () => {
    resetPath()
    const path = AStar(startNode, endNode); // Run A* algorithm
    if (path) {
        console.log('Path found:', path); // Output path to console
    } else {
       alert('No path found'); // Output if no path found
    }
});

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

//Function to reset all nodes
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

//Function to reset the path
function resetPath() {
    if (startNode == null){
        alert("Select start Node");
        return null;
    }
    if (endNode == null){
        alert("Select end Node");
        return null;
    }
    const excludeStart = nodes.find(node => node.x === startNode.x && node.y === startNode.y);
    const excludeEnd = nodes.find(node => node.x === endNode.x && node.y === endNode.y);
    nodes.forEach(node => {
        if (node != excludeStart && node != excludeEnd && node.status != 'block') {
        clearNode(node)
        }
    })
}

//Function that clears nodes individually
function clearNode(node) {
    if (node) {
        node.status = 'empty';
        node.gCost = Infinity;
        node.hCost = 0;
        node.fcost = 0;
        node.parent = null;
        const cell = document.getElementById(`x${node.x}y${node.y}`);
        cell.style.backgroundColor = ''; // Reset cell color
    }
}

//Function to calculate the heuristic cost (hCost) of nodes
function heuristic(nodeA, nodeB) {
    const dx = Math.abs(nodeA.x - nodeB.x);
    const dy = Math.abs(nodeA.y - nodeB.y);
    return dx + dy;
}

//Function to calculate the movement cost (gCost) of nodes
function movementCost(currentNode, neighbor){
    const x = currentNode.x
    const y = currentNode.y
    const nx = neighbor.x
    const ny = neighbor.y

    if (x == nx || y == ny){
        return 10
    }
    else return 14
}

//Function that will define the path result of astar function
function reconstructPath(startNode, goalNode) {
    const path = [];
    let currentNode = goalNode;
    
    while (currentNode !== null) {
        path.push(currentNode);
        currentNode = currentNode.parent;
    }
    const reversedPath = path.reverse();
    visualizePath(reversedPath, startNode, goalNode)
    return reversedPath;
}

//Function that will visualize the resulting path of the astar function
function visualizePath(path, startNode, goalNode) {
    path.forEach(node => {
        const cell = document.getElementById(`x${node.x}y${node.y}`);
        if (cell && node !== startNode && node !== goalNode) {
            cell.style.backgroundColor = '#D8ED61' //Set cell color
        }
    });
}

//Function that will handle a small delay in the astar function loop for visualization purposes
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Astar function that will calculate the shortest path from start to goal
async function AStar(startNode, goalNode) {
    if (startNode == null){
        return null;
    }
    if (endNode == null){
        return null;
    }
    startNode.gCost = 0;
    startNode.hCost = heuristic(startNode, goalNode);
    startNode.fCost = startNode.hCost;
    let openList = [startNode];
    let closedList = [];
    
    while (openList.length > 0) {
        let lowestCostNodeIndex = 0;
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].fCost < openList[lowestCostNodeIndex].fCost) {
                lowestCostNodeIndex = i;
            }
        }

        const currentNode = openList[lowestCostNodeIndex];

        if(currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
            const path = reconstructPath(startNode, goalNode);
            return path; 
        }

        const x = currentNode.x;
        const y = currentNode.y;
        const directions = [
            { dx: -1, dy: -1 }, // top-left
            { dx: 0, dy: -1 },  // top
            { dx: 1, dy: -1 },  // top-right
            { dx: -1, dy: 0 },  // left
            { dx: 1, dy: 0 },   // right
            { dx: -1, dy: 1 },  // bottom-left
            { dx: 0, dy: 1 },   // bottom
            { dx: 1, dy: 1 }    // bottom-right
        ];

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            const maxX = columns;
            const maxY = rows;

            if (newX < 0 || newY < 0 || newX >= maxX || newY >= maxY) {
                continue;
            }
        
            const neighbor = nodes.find(node => node.x === newX && node.y === newY);
            
            if (!neighbor || neighbor.status === 'block' || closedList.includes(neighbor)) {
                continue;
            }

            // Calculate fCost for the neighbor
            const moveCost = movementCost(currentNode, neighbor)
            const tentativeGCost = currentNode.gCost + moveCost;
            const hCost = (heuristic(neighbor, goalNode) * 10);
            const fCost = tentativeGCost + hCost;
            
            if (tentativeGCost < neighbor.gCost || !openList.includes(neighbor)) {
                neighbor.parent = currentNode; // Set the neighbor's parent to the current node
                neighbor.gCost = tentativeGCost; // Update the neighbor's gCost
                neighbor.hCost = hCost; // Update the neighbor's hCost
                neighbor.fCost = fCost; // Update the neighbor's fCost
            
                if (!openList.includes(neighbor)) {
                    openList.push(neighbor); // Add the neighbor to the open list
                }
            }
        }
        //Will exclude the lowestCostNode from open list for the algorithm to work properly
        openList.splice(lowestCostNodeIndex, 1);
        //Visualize the open list nodes
        openList.forEach(node => {
            const cell = document.getElementById(`x${node.x}y${node.y}`);
            if (cell && node !== startNode && node !== goalNode) {
                cell.style.backgroundColor = '#fb9062'; // Change color for open list nodes
            }
        });
        //Will add the currentNode into the closed list
        closedList.push(currentNode);
        //Visualize closed list nodes
        closedList.forEach(node => {
            const cell = document.getElementById(`x${node.x}y${node.y}`);
            if (cell && node !== startNode && node !== goalNode) {
                cell.style.backgroundColor = '#ffe5ad'; // Change color for closed list nodes
            }
        });
        await delay(10);
    }
    //Alert if no path found
    alert("No path found")
    return null; // No path found
}