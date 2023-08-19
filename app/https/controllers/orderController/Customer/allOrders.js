// const VenuesOrderModel = require("../../../../models/VenuesOrderModel");

// function allOrders() {
//     return {
//         serviceOrders: async (req, res) => {
//             const documents = await VenuesOrderModel.find({ venueId: req.body.serviceId });
//             if (!documents) {
//                 return res.status(403).json({ message: 'No Order found.' });
//             }
//             return res.status(200).json(documents);
//         }
//     }
// }

// module.exports = allOrders;