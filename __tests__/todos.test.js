require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Todo = require('../lib/models/Todo');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let todo;
  beforeEach(async() => {
    todo = await Todo.create({
      name: 'Finish This Lab',
      description: 'Like now'
    }
    );
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a todo', () => {
    return request(app)
      .post('/api/v1/todos')
      .send({
        name: 'Do it',
        description: 'now'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Do it',
          description: 'now',
          __v: 0
        });
      });
  });

  it('gets all todos', async() => {
    const todos = await Todo.create({
      name: 'Finish This Lab',
      description: 'Like now'
    }, {
      name: 'You really Need',
      description: 'to finish this lab'
    });
    return request(app)
      .get('/api/v1/todos')
      .then(res => {
        todos.forEach(todo => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            name: todo.name,
            description: todo.description,
            __v: 0
          });
        });
      });
  });

  it('gets a todo by id', async() => {
    return request(app)
      .get(`/api/v1/todos/${todo._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Finish This Lab',
          description: 'Like now',
          __v: 0
        });
      });
  });

  it('updates a todo by id', async() => {
    return request(app)
      .patch(`/api/v1/todos/${todo._id}`)
      .send({ description: 'You really need to do this' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Finish This Lab',
          description: 'You really need to do this',
          __v: 0
        });
      });
  });

  it('deletes a todo by id', async() => {
    return request(app)
      .delete(`/api/v1/todos/${todo._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Finish This Lab',
          description: 'Like now',
          __v: 0
        });
      });
  });
});
