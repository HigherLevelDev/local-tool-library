import { RestClient } from './rest-client';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from '../../src/modules/database/database.service';
import { ulid } from 'ulid';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}

export async function ensureTestUser(client: RestClient, email: string = 'test@example.com'): Promise<TestUser> {
  try {
    // First try to find existing user
    const usersResponse = await client.get(`/api/users?email=${encodeURIComponent(email)}`);
    const users = usersResponse.body;

    console.log('users found:', users);
    
    if (users && Array.isArray(users) && users.length > 0) {
      const existingUser = users[0];
      // User exists, get auth token
      const authResponse = await client.post('/api/auth/token', {
        email,
        password: 'test1234',
        grant_type: 'password'
      });

      const auth = authResponse.body;
      if (!auth || !auth.access_token) {
        throw new Error('Failed to get auth token');
      }

      client.setAuthToken(auth.access_token);
      return {
        id: auth.user.id,
        email: existingUser.email,
        name: existingUser.name,
        accessToken: auth.access_token
      };
    }

    // Create new test user
    const authResponse = await client.post('/api/auth/signup', {
      email,
      name: 'Test User',
      password: 'test1234',
      phone: '+1234567890',
      postcode: 'AB12CD'
    });

    const auth = authResponse.body;
    if (!auth || !auth.access_token || !auth.user_id) {
      throw new Error('Failed to create test user');
    }

    client.setAuthToken(auth.access_token);
    const user = auth.user;
      return {
      id: user.id,
      email: user.email,
      name: user.name,
    accessToken: auth.access_token
    };
  } catch (error) {
    console.error('Error in ensureTestUser:', error);
    throw error;
  }
}

export async function createTestUser(app: INestApplication): Promise<TestUser> {
  const db = app.get(DatabaseService);
  const now = new Date();
  const userId = ulid();
  
  await db.knex('users').insert({
    id: userId,
    email: `test-${userId}@example.com`,
    name: 'Test User',
    password_hash: '$2b$10$6RpJhPf.FvUAE6kRR9ATr.62h42bqLQhYS0Q5BYbVFD/0xAMY1ff2', // hash for 'test1234'
    phone: '+1234567890',
    postcode: 'AB12CD',
    created_at: now,
    updated_at: now
  });

  return {
    id: userId,
    email: `test-${userId}@example.com`,
    name: 'Test User',
    accessToken: 'test-token' // Not needed for repository tests
  };
}