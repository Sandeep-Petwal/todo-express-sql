// const express = require("express");
// const cors = require("cors");
// const { Sequelize, DataTypes } = require('sequelize');
// const config = require("./config/database.js");

// const app = express();
// app.use(cors());
// app.use(express.json());
// const port = 3005;

// const sequelize = new Sequelize(config);

// sequelize.authenticate()
//     .then(() => console.log('Connection has been established successfully.'))
//     .catch((error) => console.error('Unable to connect to the database:', error));

// // Define the User model
// const User = sequelize.define('users', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
// }, {
//     timestamps: true,
//     freezeTableName: true,
// });


// const Todo = sequelize.define('todos2', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     completed: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     },
//     created_at: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW
//     },
//     updated_at: {
//         type: DataTypes.DATE,
//     }
// }, {
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//     freezeTableName: true,
// });

// // has many
// User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
// Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// sequelize.sync({alter : true})
//     .then(() => {
//         console.log("Tables synced successfully");
//     })
//     .catch(err => {
//         console.error("Error in sync ", err);
//     });


// app.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//         const user = await User.create({ username, email, password });
//         res.status(201).json({ message: 'User registered successfully', user });
//     } catch (error) {
//         res.status(500).json({ error: 'Registration failed', details: error });
//     }
// });

// app.get('/gettodo/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const userTodos = await Todo.findAll({
//             where: { userId },
//             include: [{ model: User, as: 'user', attributes: ['username', 'email'] }] // add user key to response with username and email associated with that id
//         });

//         if (userTodos.length === 0) {
//             return res.status(404).json({ error: "No todos found for this user" });
//         }

//         res.json(userTodos);
//     } catch (error) {
//         res.status(500).json({ error: "Unable to fetch todos" });
//     }
// });

// // Get all todos
// app.get("/todos", (req, res) => {
//     Todo.findAll()
//         .then(todos => res.json(todos))
//         .catch(err => res.status(500).json({ error: "Unable to fetch todos" , error : err}));
// });

// // Add todo (linked to a user by userId)
// app.post('/todos', (req, res) => {
//     const { title, userId } = req.body;

//     if (!title || !userId) {
//         return res.status(400).json({ error: 'Missing todo title or user ID' });
//     }

//     Todo.create({ title, userId })
//         .then(todo => {
//             res.status(201).send(todo);
//         })
//         .catch(err => res.status(500).json({ message: 'Error creating todo', error: err }));
// });

// // Update todo
// app.put("/todos/:id", (req, res) => {
//     const { id } = req.params;
//     const { title, completed } = req.body;

//     Todo.update({ title, completed }, { where: { id } })
//         .then(([rowsUpdated]) => {
//             if (rowsUpdated === 0) {
//                 return res.status(404).json({ error: "Todo not found" });
//             }
//             res.json("Updated successfully!");
//         })
//         .catch(err => res.status(500).json({ error: "Update failed" }));
// });

// // Delete todo
// app.delete("/todos/:id", (req, res) => {
//     const { id } = req.params;
//     Todo.destroy({ where: { id } })
//         .then(rowsDeleted => {
//             if (rowsDeleted === 0) {
//                 return res.status(404).json({ error: "Todo not found" });
//             }
//             res.send("Deleted successfully!");
//         })
//         .catch(err => res.status(500).json({ error: "Deletion failed" }));
// });

// app.listen(port, () => {
//     console.log(`Todo is running at http://localhost:${port}`);
// });