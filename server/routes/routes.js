const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({extended: true}));

fs.readdirSync(__dirname).filter((file) => {
    if(file.match(/.*\.routes.js$/)) {
        console.log(file);
        app.use('/', require(path.join(__dirname, file)));
    }
});

module.exports = app;