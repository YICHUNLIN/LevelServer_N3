require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var app = express();
app.use(cors());
app.use(logger('dev'));
const fs = require('fs');



/**
 * @method GET /path
 * @description 取得 Path
 */
app.get('/data', (req, res) => {
    let data = fs.readFileSync('./data.json')
    return res.status(200).json(JSON.parse(data))
})
module.exports = app;
