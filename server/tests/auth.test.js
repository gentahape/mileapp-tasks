import request from 'supertest';
import app from '../app.js';

describe('Auth API', () => {

  describe('POST /login', () => {

    it('should return a 200 OK with a generated token and user object on successful mock login', async () => {
      const loginData = {
        email: 'test@mile.app',
        password: 'password123'
      };

      const res = await request(app)
        .post('/login')
        .send(loginData);

      expect(res.statusCode).toBe(200);

      expect(res.body.token).toBeDefined();
      expect(res.body.token).toHaveLength(64); 

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(loginData.email);
      expect(res.body.user.id).toHaveLength(24);
      expect(res.body.user.name).toBeDefined();
    });

    it('should return a 400 Bad Request if email is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should return a 400 Bad Request if password is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'test@mile.app'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should return a 400 Bad Request if body is empty', async () => {
      const res = await request(app)
        .post('/login')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

  });
  
});