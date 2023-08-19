const crypto = require("crypto");

class HashingService {
    async hashData(data) {
        const hash = await crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex');
        return hash;
    }
}

module.exports = new HashingService;