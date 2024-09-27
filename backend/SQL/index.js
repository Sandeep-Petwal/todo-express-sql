const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3005;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sandeep51',
    database: 'sandeep'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

app.get("/", (req, res) => {
    res.json({ "/todos": "Get the all todos" },)
})

// get all todos
app.get("/todos", (req, res) => {
    const sql = 'SELECT * FROM todos';
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
})

// get all todos with limit
app.get("/todos/limit/:lim", (req, res) => {
    const lim = parseInt(req.params.lim, 10);
    const sql = 'SELECT * FROM todos LIMIT ?';
    connection.query(sql, [lim], (err, results) => {
        if (err) {
            // res.send(`limit ${lim}`)
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
})

// get all todos order by last updated
app.get("/todos/order/update", (req, res) => {
    const sql = 'SELECT * FROM todos ORDER BY updated_at DESC';
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
})

// add todo 
app.post('/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Missing the todo value !' });
    }
    const sql = 'INSERT INTO todos (title) VALUES (?)';
    connection.query(sql, [title], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).send({ message: `Todo ${title} added successfully!` });
    });
});


//update
app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    if (!id || !title) {
        return res.status(400).json({ error: `Missing required fields: id ${id}, title ${title}, or completed ${completed}.` });
    }

    let sql = 'update todos set title = ?, completed = ? where id = ?'

    connection.query(sql, [title, completed, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
        res.json({ id, completed, title });
    })
})

//delete todo
app.delete("/todos/:id", (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM todos WHERE id = ?'
    connection.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
        res.status(201).json({ message: "Deleted successfully !" })
    })
})




app.listen(port, () => {
    console.log(`Todo is running at http://localhost:${port}`);
})