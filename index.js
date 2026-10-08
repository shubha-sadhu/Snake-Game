import Queue from "./queue.js";

/*
Point class:
Data members:
Row(int,x-coordinate)
column(int,y-coordinate)
*/
class Point {
    constructor(x,y) {
        this.row=x;
        this.column=y;
    }
    
    equals(checkCell) {
        return this.row==checkCell.row && this.column==checkCell.column;
    }
    toString() {
        return this.row+","+this.column;
    }
}

/*
Class Food:
Data members:
food(Point object,current position of food)
Member functions:
respawn() -> generates new coordinate of food if foodCollision() returns true
foodCollision() -> checks if new head position=current cocolumn of food
 */
class Food {
    constructor() {
        this.currFoodCell=new Point(0,0);
    }

    respawn() {

    }
    foodCollision(nextHead) {
        return this.currFoodCell.equals(nextHead);
    }
}

/*
Class Snake:
Data members: 
dir(int,current direction of head of snake)
bodyQueue(Point object queue,represents which cells body of snake fills,used during movement and rendering)
bodySet(Point object hashmap,represents which cells body of snake fills,used for collision checking)
Member functions:
setDirection() -> sanity check, change dir
move() -> decides movement of snake on each game tick
newHeadPos() -> computes the probable head position on each game tick
selfCollision() -> is new head position=cell already filled by body of snake
add() -> add new coordinate to hashmap and queue
remove() -> remove old coordinate from hashmap and queue
*/
class Snake {
    constructor() {
        this.dir=null;
        this.bodyQueue=new Queue(); // obtained from queue.js in this same directory
        this.bodySet=new Set();
    }

    setDirection(newDirection) {
        /* Edge case -> if snake spans single cell queue has single element, so there is no neck. We have to consider the empty cell in opposite
        side for this case.
        */
       let currNeck;
        if(this.bodyQueue.size()<2) {
            if(this.dir=='up')
                currNeck=this.newHeadPos('down');
            else if(this.dir=='down')
                currNeck=this.newHeadPos('up');
            else if(this.dir=='left')
                currNeck=this.newHeadPos('right');
            else if(this.dir=='right')
                currNeck=this.newHeadPos('left');
        } else {
            currNeck=this.bodyQueue.getNeck();
        }
        let nextHead=this.newHeadPos(newDirection);
        if(currNeck.row==nextHead.row && currNeck.column==nextHead.column) {
            console.log("Reverse movement was restricted.");
            return;
        }
        else
            this.dir=newDirection;
    }

    newHeadPos(newDirection=null) {
        if(newDirection==null)
            newDirection=this.dir;

        let temp=this.bodyQueue.peek();
        let nextHead=new Point(temp.row,temp.column);
        if(newDirection=='up') 
            nextHead.row--;
        else if(newDirection=='down')
            nextHead.row++;
        else if(newDirection=='left')
            nextHead.column--;
        else if(newDirection=='right')
            nextHead.column++;
        else {
            console.log("Undefined direction provided.");
        }
        return nextHead;
    }

    selfCollision(nextHead) {
        // Conersion to string is done because js can implicitly compare two strings
        let nextHeadStr=nextHead.toString(); 
        return this.bodySet.has(nextHeadStr);
    }

    move(nextHead,flag) {
        // flag==1->expand, flag==0->shift
        if(flag) 
            this.add(nextHead);
        else {
            this.add(nextHead);
            this.remove();
        }
    }

    add(p) {
        let pStr=p.toString();
        this.bodyQueue.enqueue(p);
        this.bodySet.add(pStr);
    }

    remove() {
        let temp=this.bodyQueue.dequeue();
        temp=temp.toString();
        this.bodySet.delete(temp);
    }
}


/*
Class Game:
Data members: 
totRows(int,x coordinate of last row)
totalColumns(int,y-coordinate of last column)
snake(object of snake class)
food(object of food class)
score(int,current score of player)
Member functions:
Constructor(initialize game)
gameLoop() -> loop to keep the game running infinitely
render() -> render the game graphics
checkCollision() -> check all types of collisions
wallCollision() -> checks if new head position=wall
gameWon() -> controls last part of game when won
gameOver() -> controls the last part of game when lost
inputHandler() -> only calls snake.setDirection()
*/
class Game {
    constructor(r,c) {
        this.totalRows=r;
        this.totalColumns=c;
        this.score=0;
        this.snakeObj=new Snake();
        this.foodObj=new Food();
    }

    wallCollision(nextHead) {
        return nextHead.row>this.totalRows || nextHead.column>this.totalColumns || nextHead.row<0 || nextHead.column<0;
    }

    checkCollision(nextHead) {
        if(this.wallCollision(nextHead) || this.snakeObj.selfCollision(nextHead)) {
            return 0;
        } else if(this.foodObj.foodCollision(nextHead)) {
            this.snakeObj.move(nextHead,1);
        } else {
            // If no collision occurs
            this.snakeObj.move(nextHead,0);
        }
        return 1;
    }

    inputHandler(keyPressed) {
        if(keyPressed=='ArrowUp' || keyPressed=='KeyW')
            this.snakeObj.setDirection('up');
        else if(keyPressed=='ArrowDown' || keyPressed=='KeyS')
            this.snakeObj.setDirection('down');
        else if(keyPressed=='ArrowLeft' || keyPressed=='KeyA')
            this.snakeObj.setDirection('left');
        else if(keyPressed=='ArrowRight' || keyPressed=='KeyD')
            this.snakeObj.setDirection('right');
    }

    gameLoop() {
        let temp=this.snakeObj.newHeadPos();
        let collisionResult=this.checkCollision(temp);
        if(collisionResult==0) {
            console.log("Collision detected."); 
            return this.gameOver(); 
        }
        let copiedQueue=this.snakeObj.bodyQueue.copyQueue();
        this.render(this.foodObj.currFoodCell,copiedQueue);
        if(this.snakeObj.bodyQueue.size()==this.totalColumns*this.totalRows) 
            return this.gameWon();
        return 2;
    }

    render(foodPoint,bodyQueue) {
        const cellHeight=20;
        const cellWidth=20;

        let x,y,radius=cellWidth/2 - 2,p; // Temporary variables

        // Creating canvas context
        const canvas=document.getElementById("canvas");
        const context=canvas.getContext('2d');

        // Clearing the frame every time and redrawing every pixel
        context.clearRect(0,0,canvas.width,canvas.height);

        // Drawing the food
        x=(foodPoint.column*cellHeight + cellHeight/2 );
        y=(foodPoint.row*cellWidth + cellWidth/2 );
        context.beginPath();
        // arc(x, y, radius, startAngle, endAngle, counterclockwise)
        context.arc(x,y,radius,0,Math.PI*2,false);
        context.fillStyle='yellow';
        context.fill();

        // Drawing the snake
        while(!bodyQueue.isEmpty()) {
            p=bodyQueue.dequeue();
            x=p.column*cellHeight;
            y=p.row*cellWidth;
            // fillRect(x, y, width, height)
            context.fillStyle='black';
            context.fillRect(x+1,y+1,cellWidth-1,cellHeight-1);
        }
    }

    initializeGame() {
        this.snakeObj.dir='right';
        this.snakeObj.add(new Point(4,4));
    }

    gameWon() {
        return 1;
    }

    gameOver() {
        return 0;
    }
}


// Main part under execution
const gameObj=new Game(20,20);
gameObj.initializeGame();
const loopId=setInterval(() => {
    if(gameObj.gameLoop()!=2)
        clearInterval(loopId);
}, 500);
document.addEventListener("keydown", (event) => {
    gameObj.inputHandler(event.key);
});