import { promisify } from 'util';
import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('connect', () => {
      // console.log('connected to redis');
    });
    this.client.on('error', (err) => {
      console.error(err);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const value = await getAsync(key);
    return value;
  }

  async set(key, value, expDuration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    const expireAsync = promisify(this.client.expire).bind(this.client);
    await setAsync(key, value);
    await expireAsync(key, expDuration);
    // console.log(`${key}: ${value} set`);
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
    console.log(`${key} deleted`);
  }
}

const redisClient = new RedisClient();
export default redisClient;
