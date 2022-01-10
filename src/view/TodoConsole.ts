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

                case Commands.Purge:
                    this.todoCollection.removeComplete();
                    this.promptUser();
                    break;

                case Commands.Complete:
                    if(this.todoCollection.getItemCounts().incomplete > 0){ // 완료되지않은게 하나라도 있을때만
                        this.promptComplete();
                    }
                    else{
                        this.promptUser();
                    }
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

    promptComplete() : void{
        console.clear();
        inquirer.prompt({
            type : "checkbox",
            name : "complete", // 명령어로 받았을때의 값을 받아오는 인덱스로 생각. (값을 가져오는 네임)
            message : "Mark Tasks Complete",
            choices : this.todoCollection.getTodoItems(this.showCompleted).map((item) => ({
                // 객체형태로 리턴.
                name : item.task, // 체크박스의 타이틀
                value : item.id, // id를 비교해 체크할지 말지를 비교
                checked : item.complete // 체크박스가 쭉 나왔을때, complete가 이미 true라면 체크박스가 체크된상태로 화면에 나올것임
            }))
            }).then((answer) => { // 사용자가 체크이후 엔터를 눌렀을때의 수순임. 즉, 엔터를 눌렀으면 뭘하냐
                let completedTask = answer["complete"] as number[]; // completedTask에는 체크된 item의 id가 배열로 넘어옴 
                // 사용자가 선택한 value들이 배열로 올텐데 그걸 받을거임. number의 배열형태로 단언.고정함
                
                this.todoCollection.getTodoItems(true).forEach((item) => {
                    // foreach를 돌면서 모든 아이템에 대해 아이템을 하나씩 꺼냄
                    this.todoCollection.markComplete(
                        item.id, 
                        completedTask.find((id) => id === item.id) != undefined)
                    // complete가 완료되었을경우 상태를 바꿈. 만약 찾지못하면 undefined 반환
                    // 아이디의 일치여부를 확인하고, 체크를 표시하고 빼는 작업의 과정이 여기서진행
                });
                this.promptUser();
            })
            // then하면서, 어떻게 관련내용을 처리할지 명시


            // 해당 3가지의 값을 가진 리터럴 객체들로 초이스 값을 주면, 체크박스 형태의 리스트들이 좌악 나옴
            // 기존에 있는 todoCollection으로 채워야함
            // choice명령어는 사용자가 선택 항목을 보고 선택항목의 인덱스를 반환 합니다
    }
}

export default TodoConsole;