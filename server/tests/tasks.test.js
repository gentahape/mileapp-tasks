import request from "supertest";
import app from '../app.js';
import Task from "../models/taskModel.js";
import mongoose from "mongoose";

const MOCK_TOKEN = 'test.token.123';
const MOCK_USER_ID = 'user-id-mock-123';

describe('Task API', () => {

  describe('POST /tasks', () => {

    it('should create a new task when authenticated and input is valid', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send({
          title: 'Test Title',
          description: 'Test description',
          status: 'todo'
        });
      
      expect(res.statusCode).toBe(201);

      expect(res.body.title).toBe('Test Title');
      expect(res.body.description).toBe('Test description');
      expect(res.body.status).toBe('todo');
      expect(res.body.userId).toBe(MOCK_USER_ID);

      const taskInDb = await Task.findById(res.body._id);
      expect(taskInDb).toBeDefined();
      expect(taskInDb.title).toBe('Test Title');
      expect(taskInDb.description).toBe('Test description');
      expect(taskInDb.status).toBe('todo');
      expect(taskInDb.userId).toBe(MOCK_USER_ID);
    });

    it('should return 401 Unauthorized when not authenticated', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Title',
          description: 'Test description',
          status: 'todo'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Unauthorized: No token provided');
    });

    it('should return 400 Bad Request when input is invalid', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send({
          title: '',
          description: 'Test description',
          status: 'todo'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe('Title is required');
    });

  });

  describe('GET /tasks', () => {

    it('should return all tasks', async () => {
      await Task.create([
        { title: 'Test Title 1', userId: MOCK_USER_ID },
        { title: 'Test Title 2', userId: MOCK_USER_ID },
        { title: 'Test Title 3 From Other User', userId: 'other-user-id' }
      ]);

      const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.totalItems).toBe(2);
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toBe(401);
    });

  });

  describe('GET /tasks/:id', () => {

    it('should return a single task if ID is valid and belongs to user', async () => {
      const task = await Task.create({ title: 'Test Title 1', userId: MOCK_USER_ID });

      const res = await request(app)
        .get(`/tasks/${task._id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Test Title 1');
      expect(res.body._id).toBe(task._id.toString());
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
      const fakeId = new mongoose.Types.ObjectId().toHexString();
      const res = await request(app).get(`/tasks/${fakeId}`);
      expect(res.statusCode).toBe(401);
    });

    it('should return 404 Not Found if task does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toHexString();
      const res = await request(app)
        .get(`/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Task not found');
    });

    it('should return 404 Not Found if task belongs to another user', async () => {
      const otherTask = await Task.create({ title: 'Test Title From Other User', userId: 'other-user-999' });

      const res = await request(app)
        .get(`/tasks/${otherTask._id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Task not found');
    });

    it('should return 400 Bad Request if ID format is invalid', async () => {
      const res = await request(app)
        .get('/tasks/123')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].path).toBe('id');
    });

  });

  describe('PUT /tasks/:id', () => {

    let taskToUpdate;

    beforeEach(async () => {
      taskToUpdate = await Task.create({
        title: 'Old Title',
        status: 'todo',
        userId: MOCK_USER_ID
      });
    });

    it('should update the task if authenticated and data is valid', async () => {
      const updateData = {
        title: 'New Updated Title',
        status: 'done',
      };

      const res = await request(app)
        .put(`/tasks/${taskToUpdate._id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('New Updated Title');
      expect(res.body.status).toBe('done');

      const taskInDb = await Task.findById(taskToUpdate._id);
      expect(taskInDb.title).toBe('New Updated Title');
      expect(taskInDb.status).toBe('done');
    });

    it('should return 400 Bad Request for invalid data', async () => {
      const res = await request(app)
        .put(`/tasks/${taskToUpdate._id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send({ title: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].path).toBe('title');
    });

    it('should return 404 Not Found when trying to update a task of another user', async () => {
      const otherTask = await Task.create({ title: 'Other User Task', userId: 'other-user-999' });

      const res = await request(app)
        .put(`/tasks/${otherTask._id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send({ title: 'Hacked Title' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Task not found');
    });

  });

  describe('DELETE /tasks/:id', () => {
    
    it('should delete a task if ID is valid and belongs to user', async () => {
      const task = await Task.create({ title: 'Task to delete', userId: MOCK_USER_ID });

      const res = await request(app)
        .delete(`/tasks/${task._id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(res.statusCode).toBe(204);

      const taskInDb = await Task.findById(task._id);
      expect(taskInDb).toBeNull();
    });

    it('should return 404 Not Found if task belongs to another user', async () => {
      const otherTask = await Task.create({ title: 'Other User Task', userId: 'other-user-id' });

      const res = await request(app)
        .delete(`/tasks/${otherTask._id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Task not found');
    });
  });

});