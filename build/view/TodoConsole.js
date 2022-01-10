"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __importStar(require("inquirer"));
const Todoitem_1 = __importDefault(require("../model/Todoitem"));
const TodoCollection_1 = __importDefault(require("../service/TodoCollection"));
// 모든것을 inquirer로 명시, from inquirer로부터.
const data_1 = require("../data");
const Command_1 = require("../model/Command");
class TodoConsole {
    constructor() {
        this.showCompleted = true;
        const sampleTodos = data_1.data.map((item) => new Todoitem_1.default(item.id, item.task, item.complete));
        this.todoCollection = new TodoCollection_1.default('my Todo List', sampleTodos);
    }
    displayTodoList() {
        console.log(`===== ${this.todoCollection.userName} ====` +
            `(${this.todoCollection.getItemCounts().incomplete} items todo)`); // incomplte된 count 수 표현
        this.todoCollection.getTodoItems(this.showCompleted).forEach((item) => item.printDetails());
    }
    promptUser() {
        console.clear();
        this.displayTodoList();
        inquirer.prompt({
            type: 'list',
            name: 'command',
            message: 'Choose option',
            choices: Object.values(Command_1.Commands), // 전체value들을 다 넣을수있게 object.values를..
        }).then((answer) => {
            // if(answer['command'] !== Commands.Quit)
            // {
            //     this.promptUser();
            // }
            switch (answer['command']) {
                case Command_1.Commands.Toggle:
                    this.showCompleted = !this.showCompleted;
                    // 이 키가 눌릴때마다 전체 todolist가 출력될 것인지, 아니면 해야 할 일(false)만 출력되게 할 것인지 토글됨
                    this.promptUser();
                    break;
                case Command_1.Commands.Add:
                    this.promptAdd();
                    break;
                case Command_1.Commands.Purge:
                    this.todoCollection.removeComplete();
                    this.promptUser();
                    break;
                case Command_1.Commands.Complete:
                    if (this.todoCollection.getItemCounts().incomplete > 0) { // 완료되지않은게 하나라도 있을때만
                        this.promptComplete();
                    }
                    else {
                        this.promptUser();
                    }
                    break;
            }
        });
    }
    promptAdd() {
        console.clear();
        inquirer.prompt({
            type: "input",
            name: "add",
            message: "Enter Task : "
        }).then((answer) => {
            if (answer["add"] !== "") { // 아무 문자열도 안들어오지 않았다 = 뭔가 들어왔다. 
                this.todoCollection.addTodo(answer['add']); // answer['add']에 입력한 task가 들어오는 것임.
            }
            this.promptUser();
        });
    }
    promptComplete() {
        console.clear();
        inquirer.prompt({
            type: "checkbox",
            name: "complete",
            message: "Mark Tasks Complete",
            choices: this.todoCollection.getTodoItems(this.showCompleted).map((item) => ({
                // 객체형태로 리턴.
                name: item.task,
                value: item.id,
                checked: item.complete // 체크박스가 쭉 나왔을때, complete가 이미 true라면 체크박스가 체크된상태로 화면에 나올것임
            }))
        }).then((answer) => {
            let completedTask = answer["complete"]; // completedTask에는 체크된 item의 id가 배열로 넘어옴 
            // 사용자가 선택한 value들이 배열로 올텐데 그걸 받을거임. number의 배열형태로 단언.고정함
            this.todoCollection.getTodoItems(true).forEach((item) => {
                // foreach를 돌면서 모든 아이템에 대해 아이템을 하나씩 꺼냄
                this.todoCollection.markComplete(item.id, completedTask.find((id) => id === item.id) != undefined);
                //complete가 완료되었을경우 상태를 바꿈. 
                // 아이디의 일치여부를 확인하고, 체크를 표시하고 빼는 작업의 과정이 여기서진행
            });
            this.promptUser();
        });
        // then하면서, 어떻게 관련내용을 처리할지 명시
        // 해당 3가지의 값을 가진 리터럴 객체들로 초이스 값을 주면, 체크박스 형태의 리스트들이 좌악 나옴
        // 기존에 있는 todoCollection으로 채워야함
        // choice명령어는 사용자가 선택 항목을 보고 선택항목의 인덱스를 반환 합니다
    }
}
exports.default = TodoConsole;
