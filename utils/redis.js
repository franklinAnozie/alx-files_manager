import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(error.message);
    });
  }

  isAlive() {
    if (this.client.ready) return true;
    return false;
  }

  async get(key) {
    try {
      const value = await new Promise((resolve, reject) => {
        this.client.get(key, (err, val) => {
          if (err) reject(err);
          else resolve(val);
        });
      });
      return value;
    } catch (err) {
      return err;
    }
  }

  async set(key, value, dur) {
    try {
      await new Promise((resolve, reject) => {
        this.client.set(key, value, 'EX', dur, (err, val) => {
          if (err) reject(err);
          else resolve(val);
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async del(key) {
    try {
      await new Promise((resolve, reject) => {
        this.client.del(key, (err, val) => {
          if (err) reject(err);
          else resolve(val);
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
