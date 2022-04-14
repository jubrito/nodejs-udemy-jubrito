"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.putTodo = exports.postTodo = exports.getTodos = void 0;
let todos = [];
const getTodos = (req, res, next) => {
    res.status(200).json({ todos: todos });
};
exports.getTodos = getTodos;
const postTodo = (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: new Date().toISOString(),
        text: body.text,
    };
    todos.push(newTodo);
    return res.status(201).json({ message: 'Added todo', todo: newTodo, todos: todos });
};
exports.postTodo = postTodo;
const putTodo = (req, res, next) => {
    const body = req.body;
    const params = req.params;
    const todoId = params.todoId;
    const todoIndex = todos.findIndex(todoItem => todoItem.id === todoId);
    if (todoIndex >= 0) {
        todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
        return res.status(200).json({ message: 'Updated todo', todos: todos });
    }
    res.status(404).json({ message: 'Could not find todo for this id' });
};
exports.putTodo = putTodo;
const deleteTodo = (req, res, next) => {
    const params = req.params;
    todos = todos.filter(todoItem => todoItem.id !== params.todoId);
    res.status(200).json({ message: 'Deleted todo', todos: todos });
};
exports.deleteTodo = deleteTodo;
