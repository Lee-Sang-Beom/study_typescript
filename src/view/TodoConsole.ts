import * as inquirer from 'inquirer'
import TodoItem from '../model/Todoitem';
import TodoCollection from '../service/TodoCollection'
// 모든것을 inquirer로 명시, from inquirer로부터.
import { data } from "../data";
import { Commands } from '../model/Command';

class TodoConsole{
    private todoCollection : TodoCollection;
    private showCompleted : boolean;

    constructor(){
        this.showCompleted = true;
        const sampleTodos : TodoItem[] = data.map((item) => new TodoItem(item.id, item.task, item.complete));
        this.todoCollection = new TodoCollection('my Todo List', sampleTodos);
    }

    displayTodoList() : void{
        console.log(
            `===== ${this.todoCollection.userName} ====` + 
            `(${this.todoCollection.getItemCounts().incomplete} items todo)`
        ); // incomplte된 count 수 표현

        this.todoCollection.getTodoItems(this.showCompleted).forEach((item) => item.printDetails());
    }

    promptUser() : void{ // 프롬프트 유저라는 함수는 기존에 list형태로 뿌려줬다면, add시에는 입력받는 내용이 input형태로 입력받을수있어야함
        console.clear();
        this.displayTodoList();

        inquirer.prompt({// 실제로 사용자로부터 입력받게 구성
            type: 'list', // 인풋받을 프롬프트 타입은 리스트타입
            name: 'command', // 내용은 커맨드
            message: 'Choose option', // 메시지는 choose option
            choices: Object.values(Commands), // 전체value들을 다 넣을수있게 object.values를..
        }).then((answer)=>{
            // if(answer['command'] !== Commands.Quit)
            // {
            //     this.promptUser();
            // }
            switch(answer['command']){
                case Commands.Toggle:
                    this.showCompleted = !this.showCompleted; 
                    // 이 키가 눌릴때마다 전체 todolist가 출력될 것인지, 아니면 해야 할 일(false)만 출력되게 할 것인지 토글됨
                    this.promptUser();
                    break;

                case Commands.Add:
                    this.promptAdd();
                    break;
            }

            

        })
    }

    promptAdd() : void{
        console.clear();
        inquirer.prompt({
            type : "input",
            name : "add",
            message : "Enter Task : "
        }).then((answer) => {
            if(answer["add"] !== ""){ // 아무 문자열도 안들어오지 않았다 = 뭔가 들어왔다. 
                this.todoCollection.addTodo(answer['add']); // answer['add']에 입력한 task가 들어오는 것임.
            }
            this.promptUser();
        })
    }

}

export default TodoConsole;