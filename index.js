'use strict';

const express = require('express');
const cowsay = require("cowsay");

// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
  const responseText = cowsay.say({
    text : req.query.text ? req.query.text : "hi!"
  });

  res.send(responseText);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
