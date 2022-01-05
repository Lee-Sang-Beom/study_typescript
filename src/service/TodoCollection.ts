import { ItemCounts } from "../model/itemCount";
import TodoItem from "../model/Todoitem";

class TodoCollection{ // 할일 목록
    private nextID : number = 1;
    private itemMap : Map<number, TodoItem>;
    // 맵 객체 : 제네릭 적용 > number 라는 key값과 실 저장값 TodoItem value로 구성됨

    constructor(public userName : string, todoItems : TodoItem[] = []){
        this.itemMap = new Map<number, TodoItem>();
        todoItems.forEach((item)=>this.itemMap.set(item.id, item)); // 맵객체에 값을 넣을땐 set

    } // 배열은 맨 처음에 비어있음

    getTodoById(id:number) : TodoItem | undefined{ // item이 없으면 반환할 것이 undefined라, 둘다 반환할수있게함
        // return this.todoItems.find((item) => item.id === id);
        /* 
            배열에서 find메소드가 기본제공됨.
            배열의 요소를 하나씩 꺼내서, item이라는 파라미터에 넣어봄.
            이 item의 id가 함수의 파라미터로 들어온 임의의 id와 일치하면, 그 item을 반환함
         */

        return this.itemMap.get(id); // 맵객체에서 값을 꺼낼땐 get

    }

    addTodo(task : string) : number{ // 할 일 리스트를 새로 만들것임.
        while(this.getTodoById(this.nextID)){ // 이미 할 일 리스트가 있으면 id를 늘려나감
            this.nextID++;
        }

        this.itemMap.set(this.nextID, new TodoItem(this.nextID, task)); // 하나 추가함.
        return this.nextID; // 즉, 만약에 원래 1,2번 할일목록이 있었다면, 이제 3번이 추가된거임
    }

    getItemCounts() : ItemCounts {
        return {
            total : this.itemMap.size,
            incomplete : this.getTodoItems(false).length
        }
    }
    markComplete(id : number, complete : boolean) : void {
        // 해당함수는 해당 id를 갖는 todoitem을 찾아, complete가 완료되었을경우 상태를 바꿈

        const todoItem = this.getTodoById(id); // todoItems에서 id에 해당하는 item 하나를 찾음
        if(todoItem){
            todoItem.complete = complete;
        }
    }

    getTodoItems(includeComplete : boolean) : TodoItem[] {
        // includeComplete로 들어오는 게 true라면, 모든 할일 목록을 반환함.
        // includeComplete로 들어오는 게 false라면, 완료된 할일 목록을 제외한 할일목록을 반환함.

        return [...this.itemMap.values()].filter((item) => includeComplete || !item.complete); 
        // itemMap의 values목록들을 반환하는데, 오브젝트 형태로 만들어서 넘겨주고 겉을 배열로 감싸면 todoitem[]형태가됨
        // includecomplete가 true면 모든 항목반환
        // includecomplete가 false면 item의 complete가 false인것이 true로 변경되어, 완료못한 걸 반환하게됨
    }

    removeComplete() : void{
        this.itemMap.forEach((item) => { // Map객체의 각 id를 돌면서
            if(item.complete === true){  // complete가 true면
                this.itemMap.delete(item.id); // delete함수로 id에 해당하는 목록을 삭제
            } // 이제 해야할일만 남음
        })
    }
}

export default TodoCollection;