const Direction = {
    Up: 0,
    Down: 1,
    Right: 2,
    Left: 3
}

let cells = []; // Array to store each cell data
let ids = new Set(); // Ids for each cell
let latestDirection = Direction.Down; // Direction of the adjacent node relative to the random node.
let updateNodesIdSet = new Set(); // For storing the nodes during ID update.

let screenSizeX = 1890; // Width of the screen
let screenSizeY = 950; // Height of the screen
let XSize = 0; // Width of the maze
let YSize = 0; // Height of the maze
let XOffset = 50; // Offset of the width of the maze
let YOffset = 50; // Offset of the height of the maze
let CellSize = 0; // Size of the cell

// Setup the canvas
function setup()
{
    // Get the size of the maze.
    let inputXSize = createInput(10, int);
    inputXSize.size(100, 25);
    inputXSize.position(0, 0);

    let inputYSize = createInput(10, int);
    inputYSize.size(100, 25);
    inputYSize.position(150, 0);

    let inputCellSize = createInput(50, int);
    inputCellSize.size(100, 25);
    inputCellSize.position(300, 0);

    // Generate the maze on button click.
    let button = createButton('Generate Maze');
    button.size(100, 35);
    button.position(450, 0);
    button.mousePressed(function()
    {
        XSize = Number(inputXSize.value());
        YSize = Number(inputYSize.value());
        CellSize = Number(inputCellSize.value());
        
        clear();
        Init();
    });
}

function Init()
{
    screenSizeX = XSize * CellSize + XOffset * 2;
    screenSizeY = YSize * CellSize + YOffset * 2;

    createCanvas(screenSizeX, screenSizeY); // Draw canvas
    background(180); // Color the canvas

    GenerateGrid(XSize, YSize); // Generate the grid
    DrawMaze(XSize, YSize, XOffset, YOffset, CellSize); // Draw the maze
}

// Generate the grid of cells [X, Y]
function GenerateGrid(xSize, ySize)
{
    let id = 1;

    for (let y = 0; y < ySize; y++)
    {
        cells[y] = [];

        for (let x = 0; x < xSize; x++)
        {
            // Assign an ID to each cell.
            ids.add(id);

            // Create a new cell.
            cells[y][x] = new GraphNode(id, x, y);

            id++;
        }
    }

    ConnectNeighbours();
}

// Draw the surrounding lines for the cells
function DrawMaze(xSize, ySize, offsetX, offsetY, cellSize)
{
    let start = GetRandomEdgeNode(xSize, ySize); // Set random start node.
    let end = GetRandomEdgeNode(xSize, ySize); // Set random end node.

    // Loop until the end node is not the same as start node.
    while (end == start)
    {
        end = GetRandomEdgeNode(xSize, ySize);
    }

    // Set the start and end manually if you want.
    // start = cells[0][0];
    // end = cells[ySize - 1][xSize - 1];

    DrawStartEnd(start, end, offsetX, offsetY, cellSize) // Draw the start and end node.
   
    let aStar = new Astar(start, end, cells); // Create the A* object.
    let path = aStar.GeneratePath(); // Generate the path.
    let closedSetNodes = aStar.GetClosedSet(); // Get the closed set.
    let openSetNodes = aStar.GetOpenSet(); // Get the open set.
    
    noFill(); // Dont fill up the sqaure shapes with any color.
    
    // Loop through each cell in the maze.
    for (let y = 0; y < ySize; y++)
    {
        for (let x = 0; x < xSize; x++)
        {
            let node = cells[y][x];

            // Calculate the position by adding the offset and the cell size.
            let xPos = x * cellSize + offsetX;
            let yPos = y * cellSize + offsetY;

            // Draw square if node was visited or makes a path.
            CheckForNodeType(node, path, closedSetNodes, openSetNodes, xPos, yPos, cellSize, offsetX, offsetY);

            // Draw walls for each cell.
            DrawWalls(node, xPos, yPos, cellSize);
        }
    }
}

// Connect the cells to each other
function ConnectNeighbours()
{
    // Loop until only 1 ID is left.
    while (ids.size > 1)
    {
        let node = GetRandomNode(); // Get a random node.
        let adjNode = GetRandomAdjacentNode(node.cellPosition.x, node.cellPosition.y); // Get an adjacent node to the random node.

        // If the random node and adjacent node do not belong to the same ID set.
        if (node.id != adjNode.id)
        {
            updateNodesIdSet.clear(); // Clear the update nodes set.
            JoinNodes(node, adjNode, latestDirection); // Attach nodes to each other.

            // Delete the wall between the random node and adjacent node. Each cell has 4 walls. So delete for both cells.
            node.walls.delete(latestDirection);
            adjNode.walls.delete(GetMirrorWallSide(latestDirection));

            ids.delete(adjNode.id); // Delete the old ID of the adjacent node from the ID set.
            UpdateIds(adjNode, node.id); // Update all the cells with the new ID.
        }
    }
}

// Join the nodes to each other.
function JoinNodes(mainNode, adjNode, direction)
{
    switch (direction)
    {
        case Direction.Up:
            mainNode.upNode = adjNode;
            adjNode.downNode = mainNode;
            break;
        case Direction.Down:
            mainNode.downNode = adjNode;
            adjNode.upNode = mainNode;
            break;
        case Direction.Left:
            mainNode.leftNode = adjNode;
            adjNode.rightNode = mainNode;
            break;
        case Direction.Right:
            mainNode.rightNode = adjNode;
            adjNode.leftNode = mainNode;
            break;
        default:
            console.log("Invalid Direction.")
            break;
    }
}

// Updates all the cells with the new ID using the recursive function.
function UpdateIds(node, id)
{
    // If adjacent node is not null, is not in the updateNodesIdSet, and is not in the same ID set.
    if (node.upNode && !updateNodesIdSet.has(node.upNode) && node.upNode.id != id)
    {
        updateNodesIdSet.add(node.upNode); // Add to the update set.
        UpdateIds(node.upNode, id); // Recursive function called for the new node.
        node.upNode.id = id; // Update the node id.
    }

    if (node.downNode && !updateNodesIdSet.has(node.downNode) && node.downNode.id != id)
    {
        updateNodesIdSet.add(node.downNode);
        UpdateIds(node.downNode, id);
        node.downNode.id = id;
    }
    
    if (node.leftNode && !updateNodesIdSet.has(node.leftNode) && node.leftNode.id != id)
    {
        updateNodesIdSet.add(node.leftNode);
        UpdateIds(node.leftNode, id);
        node.leftNode.id = id;
    }

    if (node.rightNode && !updateNodesIdSet.has(node.rightNode) && node.rightNode.id != id)
    {
        updateNodesIdSet.add(node.rightNode);
        UpdateIds(node.rightNode, id);
        node.rightNode.id = id;
    }
}

// Get a random node from the maze.
function GetRandomNode()
{
    // Get random x and y position.
    let x = Math.floor(Math.random() * XSize);
    let y = Math.floor(Math.random() * YSize);
    
    if (cells[y][x])
    {
        return cells[y][x];
    }
}

// Gets a random adjacent node to a given node.
function GetRandomAdjacentNode(xPos, yPos)
{
    while (true)
    {
        let direction = GetRandomDirectionVector();
    
        let x = direction[0];
        let y = direction[1];
        
        // Check if the x and y coordinates are within the grid.
        if ((yPos + y >= 0 && yPos + y < YSize) &&
            (xPos + x >= 0 && xPos + x < XSize))
        {
            // Direction of the adjacent node relative to the random node.
            latestDirection = GetWallSide(direction[0], direction[1]);

            return cells[yPos + y][xPos + x];
        }
    }
}

// Get a random direction vector.
function GetRandomDirectionVector()
{
    let random = Math.random();

    if (random < 0.25)
    {
        return [0, 1]; // Down, not up! Because cells are drawn from top to bottom.
    }
    else if (random < 0.5)
    {
        return [0, -1]; // Up
    }
    else if (random < 0.75)
    {
        return [1, 0]; // Right
    }
    else
    {
        return [-1, 0]; // Left
    }
}

// Get the direction based on the vector.
function GetWallSide(xPos, yPos)
{
    if (xPos == 0 && yPos == 1)
    {
        return Direction.Down;
    }
    else if (xPos == 0 && yPos == -1)
    {
        return Direction.Up;
    }
    else if (xPos == -1 && yPos == 0)
    {
        return Direction.Left;
    }
    else if (xPos == 1 && yPos == 0)
    {
        return Direction.Right;
    }
}

// Takes a direction and returns the opposite direction.
function GetMirrorWallSide(side)
{
    if (side == Direction.Up)
    {
        return Direction.Down;
    }
    else if (side == Direction.Down)
    {
        return Direction.Up;
    }
    else if (side == Direction.Right)
    {
        return Direction.Left;
    }
    else if (side == Direction.Left)
    {
        return Direction.Right;
    }
}

// Gets a random node from the edge of the maze.
function GetRandomEdgeNode(xSize, ySize)
{
    let edge = [];

    if (Math.random() < 0.5)
    {
        edge.push(Math.floor(Math.random() * xSize));

        if (Math.random() < 0.25)
        {
            edge.push(0);
        }
        else
        {
            edge.push(ySize - 1);
        }
    }
    else
    {
        if (Math.random() < 0.75)
        {
            edge.push(0);
        }
        else
        {
            edge.push(xSize - 1);
        }

        edge.push(Math.floor(Math.random() * ySize));
    }
    
    return cells[edge[1]][edge[0]];
}

// Draw the start and end node.
function DrawStartEnd(start, end, offsetX, offsetY, cellSize)
{
    strokeWeight(4); // Sets the thickness of the shape.

    stroke("green");
    square(start.cellPosition.x * cellSize + offsetX + cellSize / 4, start.cellPosition.y * cellSize + offsetX + cellSize / 4, cellSize / 2); // Draw start node.
    stroke("red");
    square(end.cellPosition.x * cellSize + offsetY + cellSize / 4, end.cellPosition.y * cellSize + offsetX + cellSize / 4, cellSize / 2); // Draw end node.
}

// Draw square if node was visited or makes a path.
function CheckForNodeType(node, path, closedSetNodes, openSetNodes, xPos, yPos, cellSize, offsetX, offsetY)
{
    if (path.includes(node)) // If node is on the path.
    {
        stroke("blue");
        strokeWeight(4);
        line(xPos + cellSize / 2, yPos + cellSize / 2, node.parent.cellPosition.x * cellSize + offsetX + cellSize / 2, node.parent.cellPosition.y * cellSize + offsetY + cellSize / 2);
    }
    else if (closedSetNodes.includes(node)) // If node was visited.
    {
        stroke("yellow");
        strokeWeight(1);
        square(xPos + (cellSize / 2) / 2, yPos + (cellSize / 2) / 2, cellSize / 2);
    }            
    else if (openSetNodes.includes(node)) // If node was a prospective node.
    {
        stroke('rgba(100%,0%,100%,0.5)');
        strokeWeight(4);
        square(xPos + (cellSize / 2) / 2, yPos + (cellSize / 2) / 2, cellSize / 2);
    }
}

// Draw the walls around each cell.
function DrawWalls(node, xPos, yPos, cellSize)
{
    stroke("black");
    strokeWeight(1);

    if (node.walls.has(Direction.Up))
        line(xPos, yPos, xPos + cellSize, yPos); // Draw Top Line.

    if (node.walls.has(Direction.Down))
        line(xPos, yPos + cellSize, xPos + cellSize, yPos + cellSize); // Draw Bottom Line.

    if (node.walls.has(Direction.Left))
        line(xPos, yPos, xPos, yPos + cellSize); // Draw Left Line.

    if (node.walls.has(Direction.Right))
        line(xPos + cellSize, yPos, xPos + cellSize, yPos + cellSize); // Draw Right Line.
}