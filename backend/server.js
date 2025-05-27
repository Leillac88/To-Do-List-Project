const express = require('espress');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TODOS_FILE = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function readTodos() {
    try {
        const data = await fs.readFile(TODOS_FILE, 'UTF8');
        returnJSON.parse(data);
    }   catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function saveTodos(todos) {
    await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
}

app.use((req, res, next) => {
    console.log(`${new Data().toISOString()} - ${req.method} ${req.path}`);
    next();
})

app.get('/api/todos', async (req, res) => {
    try {
        const todos = await readTodos();
        res.json(todos)
       
    } catch (error) {
        console.error("Erro ao buscar todos: ", error);
        res.status(500).json({error: "Erro interno do servidor."});
    }
})

app.get('/api/todos/:id', async (req, res) => {
    try {
        const todos = await readTodos();
        const todo = todos.find(t => t.id === parseInt(req.params.id));

        if (!todo) {
            return res.status(404).json({ error: "Tarefa não encontrada." });
        }

        res.json(todo);
    } catch (error) {
        console.error("Erro ao buscar todos: ", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
})