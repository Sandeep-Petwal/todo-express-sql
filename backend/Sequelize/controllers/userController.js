const User = require('../models/userModel');
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
const JWT_SECRET = "sandeep";
// const JWT_SECRET = process.env.PRIVATE_KEY;

exports.verifyToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        res.status(200).json({ user });
    });
};

// exports.updateUser = async (req, res) => {
//     const {userId} = req.params;
//     const { name, email } = req.body;

//     try {
//         const [rowsUpdated] = await User.update({ email, username: name }, { where: { id: userId } });
//         if (rowsUpdated == 0) {
//             res.status(404).json({ message: "User Not Found" })
//         }
//         res.json("Updated successfully!");
//     } catch (error) {
//         res.status(500).json({ error: "Update failed", error });
//     }
// }

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;

    try {
        const [rowsUpdated] = await User.update({ email, username: name }, { where: { id: userId } });
        
        if (rowsUpdated === 0) {
            return res.status(404).json({ message: "User Not Found" }); // Return immediately
        }
        
        res.json({ message: "Updated successfully!" }); // Return a message in JSON format
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Update failed", details: error.message });
    }
};


exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // if already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });


        // res.cookie('uid', token, { httpOnly: true, sameSite: 'None', secure: false });
        return res.status(200).json({ message: 'Login successful', token, userId: user.id });


    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};



