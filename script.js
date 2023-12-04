/* Grid Builder */
const gridContainer = document.getElementById('grid');
const rows = 20;
const columns = 30;

const nodes = [];

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
        const cell = document.createElement('div');
        cell.classList.add('gridCell');
        gridContainer.appendChild(cell);

        const node = {
            x: j,
            y: i,
            status: 'empty'
        }
    }
}

/* End the grid builder */