const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const userController = require('../controllers/userController');
const authJwt = require("../middleware/authJWT")


// user
router.get('/todos/:userId', authJwt, todoController.getTodosByUserId);
router.post('/todos', authJwt, todoController.createTodo);
router.put('/todos/:id', authJwt, todoController.updateTodo);
router.delete('/todos/:id', authJwt, todoController.deleteTodo);

// register
router.post('/register', userController.register);

// login
router.post("/login", userController.login);

// update user 
router.put("/user/:userId", authJwt,userController.updateUser)

// authentication 
router.get('/auth/verifyToken', userController.verifyToken);




module.exports = router;
