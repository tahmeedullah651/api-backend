const DateServices = require("../../../../../Services/DateServices");
const CustomerOrder = require("../../../../models/CustomerOrder");
const orderDates = require("../../../../models/orderDates");
const User = require("../../../../models/User");
const ServiceModel = require('../../../../models/ServiceModel');
const moment = require('moment');

function orderController() {
    return {
        saveOrder: async (req, res) => {
            const { phone, totalCost, selectedItems, charges } = req.body;
            const { serviceId, serviceName, startDate, endDate, persons, eventTime, packageSelected } = req.body.orderValues;

            if (!phone || !eventTime || !startDate || !endDate || !serviceId || !totalCost) {
                return res.status(422).json({ message: 'All fields are required' });
            }
            const isVenueExist = await ServiceModel.findById(serviceId);
            const userExist = await User.findById(req.user._id);

            if (!isVenueExist) {
                return res.status(403).json({ message: 'Venue not found' });
            }
            if (!userExist) {
                return res.status(403).json({ message: 'User not found' });
            }

            const serviceDateInfo = await orderDates.findOne({ serviceId: serviceId });
            if (!serviceDateInfo) {
                // to generate dates from start date to end date 
                const Dates = DateServices.generateDate(startDate, endDate);
                try {
                    const newOrderDates = new orderDates({
                        serviceId: serviceId,
                        allDates: [{
                            dates: Dates,
                            time: eventTime
                        }]
                    })
                    const orderDatesSaved = await newOrderDates.save();
                    if (!orderDatesSaved) {
                        return res.status(500).json({ message: "Something went wrong while saving dates" });
                    }
                } catch (error) {
                    return res.status(500).json({ message: "Internal server error" });
                }
            } else {
                const isUniqueDate = DateServices.checkDate(serviceDateInfo, startDate, eventTime);
                if (!isUniqueDate) {
                    return res.status(403).json({ message: 'Selected Day has already been taken.Please Select another date' });
                }
                const Dates = DateServices.generateDate(startDate, endDate);

                orderDates.updateOne({ _id: serviceDateInfo._id }, { $push: { allDates: { dates: Dates, time: eventTime } } }, function (error) {
                    if (error) {
                        return res.status(500).json({ message: "Something went wrong while requesting order" });
                    }
                });

            }

            // saving order 
            try {
                const newOrder = new CustomerOrder({
                    userId: req.user._id,
                    serviceId: serviceId,
                    customerName: userExist.fullName,
                    serviceName: serviceName,
                    phone: phone,
                    eventTime: eventTime,
                    noOfPersons: persons || 0,
                    totalCost: totalCost,
                    startDate: moment(startDate).format('DD/MM/YYYY'),
                    endDate: moment(endDate).format('DD/MM/YYYY'),
                    itemSelected: selectedItems,
                    charges: charges,
                    packageName: packageSelected
                })


                const result = await newOrder.save();
                if (!result) {
                    return res.status(500).json({ message: 'Internal server error.Something went wrong' })
                }
                return res.json(result);
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error.Please try again' })
            }

        },
        getUserOrders: async (req, res) => {
            const documents = await CustomerOrder.find({ userId: req.user._id });
            if (!documents.length) {
                return res.status(403).json({ message: 'No Order found.' });
            }
            return res.status(200).json(documents);
        },
        getSingleOrder: async (req, res) => {
            CustomerOrder.findById(req.body.orderid).populate('serviceId').exec((err, orderdata) => {
                if (err) {
                    return res.status(404).json({ message: "Couldnot found veneue" });
                }
                return res.json(orderdata);
            });
        },
        updateOrder: (req, res) => {
            const { phone, _id, customerName, serviceName, eventTime, noOfPersons, startDate, endDate, packageName } = req.body.orderData;
            CustomerOrder.findOneAndUpdate({ _id: _id }, {
                serviceId: req.body.orderData.serviceId._id,
                userId: req.user._id,
                customerName,
                serviceName,
                phone,
                eventTime,
                noOfPersons,
                startDate,
                endDate,
                totalCost: req.body.totalOrderCost,
                packageName,
                itemSelected: req.body.selectedItem ? req.body.selectedItem : [],
                charges: req.body.charges,
                orderStatus: "pending"
            }, { new: true }, (err, document) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' })
                }

                return res.json(document);
            })
        },
        updateOrderStatus: (req, res) => {
            const { id } = req.body;
            CustomerOrder.findOneAndUpdate({ _id: id }, { orderStatus: 'approved' }, { new: true }, (err, document) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                }
                if (!document) {
                    return res.status(404).json({ message: 'Order not found.' });
                }
                return res.json({ message: 'All ok' })
            })
        },
        deleteOrder: async (req, res) => {
            const { id } = req.body;
            const doc = await CustomerOrder.findOne({ _id: id });
            const allRegisteredDates = await orderDates.findOne({ serviceId: doc.serviceId });
            if (doc && allRegisteredDates) {
                const newDates = DateServices.removeDates(allRegisteredDates.allDates, doc.startDate, doc.endDate, doc.eventTime);

                const result = await CustomerOrder.findByIdAndDelete(id);
                if (!result) {
                    return res.status(500).json({ message: 'Something went wrong while deleting order' });
                }
                orderDates.findOneAndUpdate(
                    { _id: allRegisteredDates._id },
                    { allDates: newDates },
                    { new: true }, (err, document) => {
                        if (err) {
                            return res.status(500).json({ message: 'Internal server error' })
                        }
                    }
                )
            }
            return res.json({ message: 'all ok' });
        },
        completeOrder: (req, res) => {
            CustomerOrder.findOneAndUpdate({ _id: req.params.id }, { orderStatus: 'completed' }, { new: true }, (err, document) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                }
                if (!document) {
                    return res.status(404).json({ message: 'Order not found.' });
                }
                return res.json({ message: 'All ok' })
            })
        }
        // updateOrderAndDates: async (req, res) => {
        //     try {
        //         const { _id, startDate, endDate } = req.body.orderData;
        //         const oldOrderData = await CustomerOrder.findOne({ _id: _id });
        //         if (!oldOrderData) {
        //             return res.status(404).json({ message: 'Order not found' });
        //         }
        //         let { allDates } = await orderDates.findOne({ serviceId: oldOrderData.serviceId });
        //         if (!allDates) {
        //             return res.status(404).json({ message: 'Dates not found' });
        //         }

        //         // remove same order previous dates from service dates schema
        //         let generatedmarkup;
        //         if (oldOrderData.startDate == oldOrderData.endDate) {
        //             generatedDates = DateServices.generateDate(oldOrderData.startDate, oldOrderData.endDate);
        //             generatedmarkup = { dates: generatedDates, time: oldOrderData.eventTime }
        //         } else {
        //             generatedDates = DateServices.generateDate(oldOrderData.startDate, oldOrderData.endDate);
        //             console.log(generatedDates);
        //         }
        //         console.log(allDates);
        //         console.log(generatedmarkup);
        //         // Dates.allDates=[{ dates: [2023 - 02 - 18T00: 00: 00.000Z], time: 'morning' }]

        //     } catch (error) {
        //         return res.status(500).json({ message: 'Internal server error' });
        //     }

        // }
    }
}
module.exports = orderController;