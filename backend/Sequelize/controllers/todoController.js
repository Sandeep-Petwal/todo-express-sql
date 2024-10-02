const User = require('../models/userModel');
const Todo = require('../models/todoModel');


var jwt = require('jsonwebtoken');
const JWT_SECRET = "sandeep";


exports.getTodosByUserId = async (req, res) => {
    const { userId } = req.params;
    console.log("\nInside getTodosUserId()\n");

    try {
        const userTodos = await Todo.findAll({
            where: { userId },
            include: [{ model: User, as: 'user', attributes: ['username', 'email'] }]
        });

        if (userTodos.length === 0) {
            return res.status(204).json({ error: "No todos found for this user" }); // 204 => a request was successfully processed, but no content is available to return. 
        }
        res.json(userTodos);
    } catch (error) {
        console.log(`Error in Todo.findAll block , userId is ${userId} ❌\n`);

        console.error(error);  // Log the error to inspect it
        res.status(500).json({ error: "Unable to fetch todos", details: error.message });
    }
};


exports.createTodo = async (req, res) => {
    console.log("\nInside createTodo()\n");

    const { title, userId } = req.body;

    if (!title || !userId) {
        return res.status(400).json({ error: 'Missing todo title or user ID' });
    }

    try {
        const todo = await Todo.create({ title, userId });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error });
    }
};

exports.updateTodo = async (req, res) => {
    console.log("\nInside updateTodo()\n");

    const { id } = req.params;
    const { title, completed } = req.body;

    try {
        const [rowsUpdated] = await Todo.update({ title, completed }, { where: { id } });

        if (rowsUpdated === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json("Updated successfully!");
    } catch (error) {
        res.status(500).json({ error: "Update failed", error });
    }
};

exports.deleteTodo = async (req, res) => {
    console.log("\nInside deleteTodo()\n");

    const { id } = req.params;

    try {
        const rowsDeleted = await Todo.destroy({ where: { id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json("Deleted successfully!");
    } catch (error) {
        res.status(500).json({ error: "Deletion failed", error });
    }
};

