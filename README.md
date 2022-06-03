# MazeGeneration
This maze generation algorithm uses Randomized Kruskal's algorithm to generate a maze, then picks a random start and end point, and finally uses A* Pathfinding to find the path. Let's break it down.

**Generating the Grid**

First we generate a grid, and assign each cell a unique ID.

![Grid](https://user-images.githubusercontent.com/38834548/171783856-7f154f5c-c010-4df8-a694-4298a3a5c37a.png)



Randomized Kruskal's Algorithm
Take a random cell from the grid, and take a random adjacent node to it. If they are not already connected i.e. if they do not have the same ID, then overwrite the adjacent cell's ID and all the cells connected to it with the random cell ID.

![Connect](https://user-images.githubusercontent.com/38834548/171783940-97df743b-2fc1-461d-996f-300042fc0623.png)

![Random Connects](https://user-images.githubusercontent.com/38834548/171784032-199de370-41de-4612-b6f0-d87ff4683629.png)

![Overiding](https://user-images.githubusercontent.com/38834548/171784193-7da6a5d0-d2e3-4683-ad15-80b5d1d31d66.png)


Keep repeating this until you are only left with 1 ID. At the end you will have a maze from where you can go from one point to any other point. This maze will be having no islands.

![Maze](https://user-images.githubusercontent.com/38834548/171784267-e4e00719-40d4-443f-a904-37aeb49c4c15.png)


**AStar Pathfinding**
