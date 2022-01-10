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
        console.log(`=====${this.todoCollection.userName}====` +
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
}
exports.default = TodoConsole;
