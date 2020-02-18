const { Router } = require('express');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', (req, res) => {
    Todo
      .create(req.body)
      .then(todo => res.send(todo));
  })
  .get('/', (req, res) => {
    Todo
      .find()
      .then(todos => res.send(todos));
  })
  .get('/:id', (req, res) =>{
    Todo
      .findById(req.params.id)
      .then(todo => res.send(todo));
  })
  .patch('/:id', (req, res) => {
    Todo
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(todo => res.send(todo));
  });
