const crypto = require('crypto');
const hashingService = require('./HashingService');
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ssid = process.env.TWILIO_SSID;
const twilio = require("twilio")(ssid, authToken, {
    lazyLoading: true
});

class OtpService {
    generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }
    async sendBysms(phone, otp) {
        await twilio.messages.create({
            to: phone,
            from: process.env.TWILIO_PHONE,
            body: `Your otp for wedbook is ${otp}`
        })
    }

    async verify(data, hashedOtp) {
        const computedHash = await hashingService.hashData(data);
        return computedHash === hashedOtp;
    }

}


module.exports = new OtpService;