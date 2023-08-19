const JwtService = require("../../../Services/JwtServices");

const vendor = async (req, res, next) => {
    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: 'Only vendor can register' });
    }
    next();
}

module.exports = vendor;