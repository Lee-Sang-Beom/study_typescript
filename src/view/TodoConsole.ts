import * as inquirer from 'inquirer'
import TodoItem from '../model/Todoitem';
import TodoCollection from '../service/TodoCollection'
// 모든것을 inquirer로 명시, from inquirer로부터.
import { data } from "../data";
import { Commands } from '../model/Command';

class TodoConsole{
    private todoCollection : TodoCollection;

    constructor(){
        const sampleTodos : TodoItem[] = data.map((item) => new TodoItem(item.id, item.task, item.complete));
        this.todoCollection = new TodoCollection('my Todo List', sampleTodos);
    }

    displayTodoList() : void{
        console.log(
            `=====${this.todoCollection.userName}====` + 
            `(${this.todoCollection.getItemCounts().incomplete} items todo)`
        ); // incomplte된 count 수 표현

        this.todoCollection.getTodoItems(true).forEach((item) => item.printDetails());
    }

    promptUser() : void{
        console.clear();
        this.displayTodoList();

        inquirer.prompt({// 실제로 사용자로부터 입력받게 구성
            type: 'list', // 인풋받을 프롬프트 타입은 리스트타입
            name: 'command', // 내용은 커맨드
            message: 'Choose option', // 메시지는 choose option
            choices: Object.values(Commands), // 전체value들을 다 넣을수있게 object.values를..
        }).then((answer)=>{
            if(answer['command'] !== Commands.Quit)
            {
                this.promptUser();
            }

        })
    }

}

export default TodoConsole;