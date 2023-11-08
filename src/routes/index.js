const express = require('express');
const userRoutes = require('./userRoutes');
const shopRoutes = require('./shopRoutes');
const transactionRoutes = require('./transactionRoutes');

const api = express.Router();

api.use('/users', userRoutes);
api.use('/shops', shopRoutes);
api.use('/transactions/create', transactionRoutes);

api.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

// POST method route
api.post('/', (req, res) => {
    res.send('POST request to the homepage')
})


module.exports = api;
