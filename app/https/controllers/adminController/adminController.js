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
        approveService: async (req, res) => {
            try {
                const doc = await ServiceModel.findOneAndUpdate({ _id: req.params.id }, { status: 'approved' }, { new: true });

                if (doc) {
                    return res.status(200).json({ message: "ok" });
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Something went wrong" });

            }
            // ServiceModel.findOneAndUpdate({ _id: req.params.id }, { status: 'approved' }, { new: true }, (err, document) => {
            //     if (err) {
            //         return res.status(500).json({ message: 'Internal server error' });
            //     }
            //     if (!document) {
            //         return res.status(404).json({ message: 'Order not found.' });
            //     }
            //     return res.json({ message: 'All ok' })
            // })
        },
        deleteService: async (req, res) => {
            try {
                const data = await ServiceModel.findOneAndRemove({
                    _id: req.params.id
                }).exec();
                if (data) {
                    return res.status(200).json({ message: 'All ok' });
                }
            } catch (error) {
                return res.status(500).json({ message: "Something went wrong" });
            }

        }
    }
}

module.exports = adminController;
