'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 9001;

const jsonParser = bodyParser.json();
app.use(express.static('public'));

app.get('/comment', (req, res) => {
  const data = fs.readFileSync('commentsAPIFile', {encoding: 'UTF-8'});
  res.send(data);
});

app.post('/comment', jsonParser, (req, res) => {
  const oldComments = fs.readFileSync('commentsAPIFile', {encoding: 'UTF-8'});
  const comments = [req.body, ...JSON.parse(oldComments || JSON.stringify(''))];
  fs.writeFileSync('commentsAPIFile', JSON.stringify(comments));
  res.send('1');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});