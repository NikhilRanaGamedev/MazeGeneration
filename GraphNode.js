class GraphNode
{
    constructor(id, xPos, yPos)
    {
        this.id = id;
        this.cellPosition = createVector(xPos, yPos)
        this.walls = new Set([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);
        
        this.upNode = this;
        this.downNode = this;
        this.leftNode = this;
        this.rightNode = this;

        this.fCost = 0;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = this;
    }
}