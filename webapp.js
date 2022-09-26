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


app.get('/tmp_data', (req, res) => {
    let data = fs.readFileSync('./tmp_data.json')
    return res.status(200).json(JSON.parse(data))
})

app.get('/cloudCenter', (req, res) => {
    let data = fs.readFileSync('./cloudCenter.json')
    return res.status(200).json(JSON.parse(data))
})

app.get('/ori_data', (req, res) => {
    let data = fs.readFileSync('./ori_data.json')
    return res.status(200).json(JSON.parse(data))
})


app.get('/refit_center', (req, res) => {
    let data = fs.readFileSync('./refitCenter.json')
    return res.status(200).json(JSON.parse(data))
})


app.get('/data', (req, res) => {
    let data = fs.readFileSync('./data.json')
    return res.status(200).json(JSON.parse(data))
})

app.get('/center', (req, res) => {
    let data = fs.readFileSync('./center.json')
    return res.status(200).json(JSON.parse(data))
})
module.exports = app;
