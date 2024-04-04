const Redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();
    this.connectToRedis();
  }

  async publish(channel, message) {
    await this.publisher.connect();

    return new Promise(async (resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.connect();

    this.subscriber.subscribe(channel, (message) => {
      console.log('Subscribed to ', channel);
    });

    this.subscriber.on('message', function (subscriberChannel, message) {
      if (channel == subscriberChannel) {
        callback(channel, message);
      }
    });
  }

  connectToRedis() {
    this.subscriber.on('error', (err) => {
      console.error('Subscriber error:', err);
      this.subscriber.quit();
      this.subscriber = Redis.createClient();
      this.connectToRedis(); // Thử kết nối lại
    });

    this.publisher.on('error', (err) => {
      console.error('Publisher error:', err);
      this.publisher.quit();
      this.publisher = Redis.createClient();
      this.connectToRedis(); // Thử kết nối lại
    });
  }
}

module.exports = new RedisPubSubService();
