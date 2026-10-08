class Point {
    constructor(x,y) {
        this.row=x;
        this.column=y;
    }
}

class Queue {
    constructor() {
        this.front=-1;
        this.rear=-1;
        this.arr=[];
    }

    enqueue(data) {
        if(this.front==-1 && this.rear==-1)
            this.front=this.rear=0;
        else
            this.rear++;
        this.arr.push(data);
    }
    dequeue() {
        let temp=this.arr[this.front];
        if(this.front==this.rear)
            this.front=this.rear=-1;
        else
            this.front++;
        return temp; 
        // Not doing arr.shift() because it changes the array index which makes our front and rear useless.
    }
    peek() {
        if(this.front==-1 && this.rear==-1){
            console.log("Peek on empty queue.");
            return;
        }
        return this.arr[this.rear];
    }
    size() {
        return (this.rear-this.front+1);
    }

    // getNeck() returns the element previous to rear element
    getNeck() {
        if(this.size()<2) {
            console.log("Cannot get neck element for queue with single element.");
            return;
        }
        return this.arr[this.rear-1];
    }
    isEmpty() {
        return this.front==-1 && this.rear==-1;
    }

    // copyQueue() acts as copy constructor
    copyQueue() {
        let newQueue=new Queue();
        newQueue.front=this.front;
        newQueue.rear=this.rear;
        newQueue.arr=[];
        for(let element of this.arr)
            newQueue.arr.push(new Point(element.row,element.column));
        return newQueue;
    }
}

export default Queue;