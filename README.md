# nodepress-healthchecker

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
