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
    });
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
});
