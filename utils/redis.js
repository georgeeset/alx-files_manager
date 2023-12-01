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
    try {
      return this.client.connected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      const value = await getAsync(key);
      return value;
    } catch (error) {
      console.error(error);
    }
  }

  async set(key, value, expDuration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    const expireAsync = promisify(this.client.expire).bind(this.client);

    try {
      await setAsync(key, value);
      await expireAsync(key, expDuration);
      //console.log(`${key}: ${value} set`);
    } catch (error) {
      console.error(error);
    }
  }

  async del(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const delAsync = promisify(this.client.del).bind(this.client);

    try {
      const value = await getAsync(key);
      if (value !== null) {
        await delAsync(key);
        console.log(`${key} deleted`);
      } else {
        console.log(`${key} does not exist`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
