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

  let todos;
  beforeEach(async() => {
    todos = await Todo.create({
      name: 'Finish This Lab',
      description: 'Like now'
    }, {
      name: 'You really Need',
      description: 'to finish this lab'
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
    const todo = await Todo.create({
      name: 'Finish This Lab',
      description: 'Like now'
    });

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
});
