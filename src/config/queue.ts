import { config } from "./config";

const redisConnection = {
    host:config.host,
    port:config.Port
}

 const defaultQueueConfig={
    removeOnComplete: {
        count:100,
        age:60*60*24
    },
    attempts:4,
    backoff:1000
}
export {redisConnection,defaultQueueConfig};