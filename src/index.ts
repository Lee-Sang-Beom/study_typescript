import TodoItem from "./model/Todoitem";
import TodoCollection from "./service/TodoCollection";
import { data } from "./data";
import TodoConsole from "./view/TodoConsole";

const todoConsole = new TodoConsole();
todoConsole.promptUser();