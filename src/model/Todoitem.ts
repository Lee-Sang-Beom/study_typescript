class TodoItem{
    constructor(public id : number, public task : string, public complete : boolean = false){
        this.id = id;
        this.task = task;
        this.complete = complete;
    }

    printDetails() : void{
        console.log(`${this.id}, ${this.task}, ${this.complete ? 'true' : 'false'}`);
    }

}

export default TodoItem; // 이 클래스를 외부에서 사용할 수 있도록 하기 위함.