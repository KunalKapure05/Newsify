import redis from 'express-redis-cache';


const redisCache = redis({
    port:6379,
    host:'localhost',
    expire: 60 * 60 ,
    prefix: 'Newsify'

})

export default redisCache;