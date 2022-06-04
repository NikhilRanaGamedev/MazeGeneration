class Astar
{
    constructor(start, end, cells)
    {
        this.start = start;
        this.end = end;
        this.cells = cells;
    }

    // Generate the path.
    GeneratePath()
    {
        let openSet = [];
        let closedSet = [];
        
        // Add the starting node to the open set.
        openSet.push(this.start);

        // Loop until open set is greater than 0.
        while (openSet.length > 0)
        {
            // Find the lowest F cost node.
            let currentNode = this.GetLowestFCost(openSet);

            // Remove the node from the open set.
            let currentNodeIndex = openSet.indexOf(currentNode);
            if (currentNodeIndex !== -1)
            {
                openSet.splice(currentNodeIndex, 1);
            }

            // Push the node to the closed set.
            closedSet.push(currentNode);

            // If the current node is the end node, return the path.
            if (currentNode == this.end)
            {
                this.openSet = openSet;
                this.closedSet = closedSet;
                return this.RetracePath(currentNode);
            }

            // Get the neighbours of the current node.
            let neigbours = [currentNode.upNode, currentNode.downNode, currentNode.leftNode, currentNode.rightNode];

            // Loop through the neighbours.
            for (let i = 0; i < neigbours.length; i++)
            {
                // If the neighbour is in the closed set, skip it.
                if (!neigbours[i] || closedSet.includes(neigbours[i]))
                {
                    continue;
                }
                
                // Calculate the gCost for the current node.
                let gCost = currentNode.gCost + 1;
                
                // If the neighbour is not in the open set, or the current gCost is greater than its older gCost.
                if (gCost < neigbours[i].gCost || !openSet.includes(neigbours[i]))
                {
                    neigbours[i].parent = currentNode; // Parent the currentNode to the neighbour.
                    
                    neigbours[i].gCost = gCost; // Set the gCost of the neighbour.
                    neigbours[i].hCost = this.GetManhattanDistance(neigbours[i].cellPosition); // Set the hCost(distance from the endNode) of the neighbour.
                    neigbours[i].fCost = neigbours[i].gCost + neigbours[i].hCost; // Set the fCost of the neighbour.

                    openSet.push(neigbours[i]); // Add the neighbour to the open set.
                }
            }
        }
    }

    // Retraces the path by going through the parent of each node.
    RetracePath(node)
    {
        let path = [];
        
        while (node != this.start)
        {
            path.push(node);
            node = node.parent;
        }

        return path;
    }

    // Gets the lowest fCost from the passed open set.
    GetLowestFCost(list)
    {
        let lowestFCost = list[0].fCost;
        let bestNode = list[0];

        for (let i = 0; i < list.length; i++)
        {
            if (list[i].fCost < lowestFCost)
            {
                lowestFCost = list[i].fCost;
                bestNode = list[i];
            }
        }

        return bestNode;
    }

    // Calculate the distance between a node and the end node using the Manhattan Distance.
    GetManhattanDistance(node)
    {
        return Math.abs(this.end.cellPosition.x - node.x) + Math.abs(this.end.cellPosition.y - node.y);
    }

    GetClosedSet()
    {
        return this.closedSet;
    }

    GetOpenSet()
    {
        return this.openSet;
    }
}