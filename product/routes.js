const express = require('express');
const controller = require('./controller');
const multer = require('multer');
const auth = require('../middlewares/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.post('/create',auth, controller.createModel)
app.post('/delete/:id',auth, controller.deleteModel)
app.get('/get-models/:id?', auth, controller.getModels)
app.get('/get-model-detail/:id?', controller.getModels)
app.post('/upload',upload.single('glbmodel'), controller.uploadGlb)

module.exports = app;