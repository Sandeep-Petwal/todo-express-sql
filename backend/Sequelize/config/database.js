const { Sequelize } = require('sequelize');
const config = require("./config")

const sequelize = new Sequelize(config);

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
