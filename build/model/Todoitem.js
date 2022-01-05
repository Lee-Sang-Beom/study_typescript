"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TodoItem {
    constructor(id, task, complete = false) {
        this.id = id;
        this.task = task;
        this.complete = complete;
        this.id = id;
        this.task = task;
        this.complete = complete;
    }
    printDetails() {
        console.log(`${this.id}, ${this.task}, ${this.complete ? 'true' : 'false'}`);
    }
}
exports.default = TodoItem; // 이 클래스를 외부에서 사용할 수 있도록 하기 위함.
