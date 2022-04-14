import { Router } from 'express';
import { getTodos, postTodo, putTodo, deleteTodo } from '../controllers/todos';

const router = Router();

router.get('/', getTodos);

router.post('/todo', postTodo);

router.put('/todo/:todoId', putTodo);

router.delete('/todo/:todoId', deleteTodo);

export default router;