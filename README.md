# nodepress-healthchecker

### Environment
`HEALTH_CHECK_LOG`: false

### redis
```typescript
import * as redis from 'redis'
import * as healthChecker from "nodepress-healthchecker";

const client = redis.createClient({
    host: 'redis'
});

healthChecker.init([{
    category: 'redis',
    healthCheckHandler: () => {
        return new Promise(((resolve, reject) => {
            try {
                let ping = client.ping();
                if (ping) {
                    resolve();
                }
                reject();
            } catch (e) {
                console.error("REDIS NOT CONNECTED");
                reject();
            }
        }));
    }
}]);

```
### rabbitmq
```typescript
import * as amqp from 'amqplib/callback_api';
import * as healthChecker from "nodepress-healthchecker";

let rabbitmq: amqp.Connection;

amqp.connect('amqp://rabbitmq', (err, connection) => {
        if (err) {
          console.error('connect error', err);
        } else {
          rabbitmq = connection;
          console.log('RABBITMQ CONNECTED');
        }
      });

healthChecker.init([{
    category: 'rabbit',
    healthCheckHandler: () => {
        return new Promise(((resolve, reject) => {
            try {
                if (rabbitmq) {
                    resolve();
                } else {
                    reject();
                }
            } catch (e) {
                console.error("RABBIT NOT CONNECTED");
                reject();
            }
        }));
    }
}]);

```
### MongoDB
```typescript
import {MongoClient} from "mongodb";
import * as healthChecker from "nodepress-healthchecker";

let mongodb: MongoClient;
MongoClient.connect('mongodb://mongo-db:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5
}, (err, client) => {
    if (err) {
        console.error(err);
    } else {
        mongodb = client;
    }
});

healthChecker.init([{
    category: 'mongo',
    healthCheckHandler: () => {
        return new Promise<void>(((resolve, reject) => {
            mongodb.db().command({ping: 1})
                .then(() => resolve())
                .catch(() => reject());
        }));
    }
}]);

```
