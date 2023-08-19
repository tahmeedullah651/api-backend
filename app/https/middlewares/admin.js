
const admin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only for admin' });
    }
    next();
}

module.exports = admin;