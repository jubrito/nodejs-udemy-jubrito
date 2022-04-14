import express from 'express'; // typically import on client side

import todosRoutes from './routes/todos'

const app = express();

app.use(todosRoutes);

app.listen(3000); 