const ServiceModel = require("../../../models/ServiceModel");
const User = require("../../../models/User");

function adminController() {
    return {
        index: async (req, res) => {
            try {
                const allServices = await ServiceModel.find();
                const allCustomer = await User.find({ role: { $not: { $eq: "admin" } } }).sort({ fullName: 'asc' });
                return res.status(200).json({ allServices, allCustomer });
            } catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        },
        approveService: (req, res) => {
            ServiceModel.findOneAndUpdate({ _id: req.params.id }, { status: 'approved' }, { new: true }, (err, document) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                }
                if (!document) {
                    return res.status(404).json({ message: 'Order not found.' });
                }
                return res.json({ message: 'All ok' })
            })
        },
        deleteService: async (req, res) => {
            ServiceModel.findOneAndRemove({ _id: req.params.id }, (err, document) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.json({ message: 'All ok' })
            })
        }
    }
}

module.exports = adminController;