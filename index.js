'use strict';

const express = require('express');
const cowsay = require("cowsay");

// Constants
const PORT = 8080;

// App
const app = express();

app.get("/", function (req, res) {
  res.redirect("/Hello from Docker!");
});

app.get("/:text", function (req, res) {
  let text;

  try {
    text = req.params.text;
  } catch (e) {
    text = "Hi Awesome HackTalks People!";
  }
  const responseText = `<pre>${cowsay.say({ text })}</pre>`;

  res.send(responseText);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
