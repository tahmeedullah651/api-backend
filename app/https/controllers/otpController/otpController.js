
const HashingService = require('../../../../Services/HashingService');
const OtpService = require('../../../../Services/OtpService');

class otpController {
    async sendOtp(req, res) {
        const { phone } = req.body;
        if (!phone) {
            return res.status(403).json({ "message": "Phone number is required" });
        }
        const otp = OtpService.generateOtp();
        // time to leave
        const ttl = 1000 * 60 * 1; // 3 minutes
        const expire = Date.now() + ttl; // current time + 5 minutes
        const data = `${phone}.${expire}.${otp}`;
        const hashedOtp = await HashingService.hashData(data);
        try {
            await OtpService.sendBysms(phone, otp);
            return res.json({
                "hashedOtp": `${hashedOtp}.${expire}`,
                phone
            })
        } catch (error) {
            return res.status(500).json({ "Message": "Message sending failed" });
        }
    }

    async verifyOtp(req, res) {
        const { phone, hashedOtp, otp } = req.body;
        if (!phone || !hashedOtp || !otp) {
            return res.status(403).json({ "message": "Please enter OTP" });
        }

        const [hash, expire] = hashedOtp.split('.');
        if (Date.now() > +expire) {
            return res.status(409).json({ "message": "Otp has been expired" });
        }

        const data = `${phone}.${expire}.${otp}`;
        const isValid = await OtpService.verify(data, hash);
        if (!isValid) {
            return res.status(409).json({ "message": "Wrong otp.Please enter correct otp and try again" });
        }
        return res.json({ "message": "OTP verified" });
    }
}


module.exports = new otpController;
