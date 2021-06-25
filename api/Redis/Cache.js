
const redis = require('redis')
const REDIS_PORT = process.env.REDIS_PORT || 5002
const redisClient = redis.createClient(REDIS_PORT)

// Vendors caching
const Vendors = async (req, res, next) => {
    try {
        const vendorsKey = 'vendors'
        redisClient.get(vendorsKey, (error, results) => {
            if (results) {
                return res.status(200).json({
                    status: true,
                    source: 'cache',
                    data: JSON.parse(results)
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
    redisClient,
    Vendors
}