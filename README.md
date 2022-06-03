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
