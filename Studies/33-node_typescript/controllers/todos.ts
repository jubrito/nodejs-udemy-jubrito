let todos: Todo[] = [];
import { Todo } from '../models/todo';

type RequestBody = { text: string };
type RequestParams = { todoId: string };
import { Request, Response, NextFunction } from 'express';

export const getTodos = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ todos: todos });
}

export const postTodo = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as RequestBody;
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text,
    }
    todos.push(newTodo);
    return res.status(201).json({ message: 'Added todo', todo: newTodo, todos: todos })
}

export const putTodo = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as RequestBody;
    const params = req.params as RequestParams;
    const todoId = params.todoId;
    const todoIndex = todos.findIndex(todoItem => todoItem.id === todoId);
    if (todoIndex >= 0) {
        todos[todoIndex] = { id: todos[todoIndex].id, text: body.text }
        return res.status(200).json({ message: 'Updated todo', todos: todos })
    }
    res.status(404).json({ message: 'Could not find todo for this id' })
}

export const deleteTodo = (req: Request, res: Response, next: NextFunction) => {
    const params = req.params as RequestParams;
    todos = todos.filter(todoItem => todoItem.id !== params.todoId)
    res.status(200).json({ message: 'Deleted todo', todos: todos })
}