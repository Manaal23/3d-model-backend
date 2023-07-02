const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./dbConnection');
const auth = require('./middlewares/auth');
const app = express();

app.use(cors());

const userRoutes = require('./userAuth/routes');
const productRoutes = require('./product/routes');

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/product', productRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("Server is running at port:" + port);
})