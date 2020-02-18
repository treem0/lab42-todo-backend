const { Router } = require('express');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', (req, res) => {
    Todo
      .create(req.body)
      .then(todo => res.send(todo));
  });
