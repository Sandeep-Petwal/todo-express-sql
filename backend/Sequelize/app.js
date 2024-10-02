const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const routes = require('./routes/routes.js');
require('dotenv').config(); 

const app = express();
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());

// handle error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Routes
app.use('/api', routes);

// Sync database
sequelize.sync()
    .then(() => console.log('Tables synced successfully'))
    .catch(err => console.error('Error in sync:', err));

const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
