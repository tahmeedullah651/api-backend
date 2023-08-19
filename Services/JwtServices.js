const jwt = require('jsonwebtoken');
const RefreshModel = require('../app/models/RefreshModel');
const access_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_secret = process.env.REFRESH_TOKEN_SECRET;

class JwtService {

    static generateToken(payload) {
        const accessToken = jwt.sign(payload, access_secret, {
            expiresIn: '1h'
        })
        const refreshToken = jwt.sign(payload, refresh_secret, {
            expiresIn: '24h'
        })

        return { accessToken, refreshToken };
    }


    static async storeRefreshToken(token, userId) {
        try {
            const newRefresh = new RefreshModel({
                token,
                userId
            })

            const result = await newRefresh.save();
            return { result };
        } catch (error) {
            console.log(error);
        }
    }


    static async verifyAccessToken(token) {
        return jwt.verify(token, access_secret);
    }

    static async verifyRefreshToken(token) {
        return jwt.verify(token, refresh_secret);

    }

    static async findRefreshToken(userId, refreshtoken) {
        return await RefreshModel.findOne(
            {
                userId: userId,
                token: refreshtoken
            }
        )
    }

    static async updateRefreshToken(userId, refreshToken) {
        return await RefreshModel.updateOne({ userId: userId }, { token: refreshToken })
    }
}

module.exports = JwtService;