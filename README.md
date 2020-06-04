# nodepress-healthchecker


### mariaDB
```ts
import {RdbService} from 'js-express-server'
import * as healthChecker from "nodepress-healthchecker";

healthChecker.init([{
    category: 'maria',
    checkHealthHandler: () => {
        return new Promise(((resolve, reject) => {
            RdbService.getConnectionSafe(async (connection) => {
                let row;
                try {
                    row = await connection.query("SELECT 1");
                    if (row?.results?.length < 1) {
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
