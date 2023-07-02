const express = require('express');
const Controller = require('./controller');
const app = express();


app.post('/signup', Controller.signup)
app.post('/login', Controller.login)

module.exports = app;