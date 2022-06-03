# MazeGeneration
This maze generation algorithm uses Randomized Kruskal's algorithm to generate a maze, then picks a random start and end point, and finally uses A* Pathfinding to find the path. Let's break it down.

**Generating the Grid**

First we generate a grid, and assign each cell a unique ID.

![Grid](https://user-images.githubusercontent.com/38834548/171787576-bc10fcc8-3b91-471d-b6e1-7ff0e24ef207.png)



Randomized Kruskal's Algorithm
Take a random cell from the grid, and take a random adjacent node to it. If they are not already connected i.e. if they do not have the same ID, then overwrite the adjacent cell's ID and all the cells connected to it with the random cell ID.

![Random Connects](https://user-images.githubusercontent.com/38834548/171787596-a6f3bb83-d662-4839-b738-8a237fbe7aff.png)

![Override](https://user-images.githubusercontent.com/38834548/171787606-753e0bf7-8297-4554-993c-2e473c717f09.png)


Keep repeating this until you are left with only 1 ID. At the end you will have a maze from where you can go from one point to any other point. This maze will be having no islands.

![Maze Complete](https://user-images.githubusercontent.com/38834548/171787629-07a177bb-2ba3-440a-8105-44f248feb929.png)


**AStar Pathfinding**

The AStar Pathfinding is a well known pathfinding algorithm. Here, we are not going to pathfind using diagonals i.e we can only walk either up/down/left/right. Create 2 lists/arrays for storing the nodes, open set (prospective nodes to search on) and closed set(nodes already searched on).

Step 1: We take the start point, and add it to the open set.
Step 2: Pick the node with the lowest fCost in the open set, and lets call it the current node.
Step 3: Add the current node to the closed set.
Step 4: Check the adjacent neighbours to the current node.

![Adjacent Cells](https://user-images.githubusercontent.com/38834548/171789306-c29753d3-9d86-4f65-b3f6-3e1aa9790c2f.png)

Each cell has 3 values -<br>
gCost: The distance from the start node to this node.<br>
hCost: The distance from the end node to this node.<br>
fCost: gCost + hCost.<br>

![Node](https://user-images.githubusercontent.com/38834548/171789432-f9f3a3b8-423b-4680-b441-48a3f50c6f35.png)

Step 5: If the neighbour is not walkable or in the closed set, then ignore it.
        If it is not in the open set, then calculate the gCost, hCost, and fCost, and add it to the open set.
        If it is in the open set, then check if the current gCost is lower than the one in the open set, then update the gCost, hCost, and fCost.
        Parent the current node to this neighbouring node.
        
Step 6: Rinse and Repeat from Step 2 to Step 6. Stop when you have added the end node to the open set, or when your open set becomes empty(meaning there is no path from start node to end node).

Stt 7: Once the end node has been reached, go through the parent of each node to create a path to the start node. You can then reverse this list to get a path from start to end.

Yellow nodes are the nodes in the closed set.<br>
Pink nodes are the nodes in the open set.<br>
Green is the start node and red is the end node.<br>

![Maze](https://user-images.githubusercontent.com/38834548/171792439-0b431d82-237b-46fc-97d3-0300cdf49841.png)
