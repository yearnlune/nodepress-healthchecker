# nodepress-healthchecker


### mariaDB
```ts
import {RdbService} from 'js-express-server'
import * as healthChecker from "nodepress-healthchecker";

healthChecker.init([{
    category: 'maria',
    healthCheckHandler: () => {
        return new Promise(((resolve, reject) => {
            RdbService.getConnectionSafe(async (connection) => {
                let row;
                try {
                    row = await connection.query("SELECT 1");
                    if (row.results.length < 1) {
                        console.error('reject', reject)
                        reject();
                    }
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }).catch(e => {
                console.log("DB NOT CONNECTED");
                reject(e);
            });
        }));
    }
}]);


```

### redis
```ts
import * as redis from 'redis'
import * as healthChecker from "nodepress-healthchecker";

const client = redis.createClient({
    host: 'redis'
});

healthChecker.init([{
    category: 'maria',
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
