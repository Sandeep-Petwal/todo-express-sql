const express = require("express");
const cors = require("cors")
const mysql2 = require("mysql2")
const { Sequelize, DataTypes } = require('sequelize');
const config = require("./database")

const app = express();
app.use(cors());
app.use(express.json());
const port = 3005;


// const sequelize = new Sequelize("sandeep", "root", "sandeep51", {
//     host: "localhost",
//     dialect: 'mysql'
// })
const sequelize = new Sequelize(config);

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error))


const Todo = sequelize.define('todos2', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: true,            //  automatic timestamps
    createdAt: 'created_at',     // link createdAt to created_at
    updatedAt: 'updated_at',     // ""
    freezeTableName: true,
});

module.exports = Todo;


sequelize.sync()
    .then(() => {
        console.log("Todos table synced");
    })
    .catch(err => {
        console.error("Error in sync ", err);
    });


app.get("/", (req, res) => {
    res.json({ "/todos": "Get the all todos" },)
})

// get all todos
app.get("/todos", (req, res) => {
    Todo.findAll()
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json({ error: "Unable to fetch todos" }));
});

// add todo 
app.post('/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Missing the todo value !' });
    }
    Todo.create({ title })
        .then(todos => {
            res.status(201).send(todos);
        })
});

//update
app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    Todo.update({ title, completed }, { where: { id } })
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) {
                return res.status(404).json({ error: "Todo not found" });
            }
            res.json("Updated successfully!");
        })
        .catch(err => res.status(500).json({ error: "Update failed" }));
});


//delete todo
app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    Todo.destroy({ where: { id } })
        .then(rowsDeleted => {
            if (rowsDeleted === 0) {
                return res.status(404).json({ error: "Todo not found" });
            }
            res.send("Deleted successfully!");
        })
        .catch(err => res.status(500).json({ error: "Deletion failed" }));
});


app.listen(port, () => {
    console.log(`Todo is running at http://localhost:${port}`);
})