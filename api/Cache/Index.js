const redis = require("redis")

const REDIS_PORT = process.env.REDIS_PORT || 5002
const RedisClient = redis.createClient(REDIS_PORT)

const Banners = async (req, res, next) => {
    try {
        const key = 'banners'
        RedisClient.get(key, (error, results) => {
            if (results) {
                return res.status(200).json({
                    status: true,
                    banners: JSON.parse(results)
                })
            } else {
                next()
            }
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    RedisClient,
    Banners
}