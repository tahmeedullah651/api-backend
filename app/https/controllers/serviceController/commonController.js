const ServiceModel = require('../../../models/ServiceModel');
const orderDates = require('../../../models/orderDates');
const TestimonialModel = require('../../../models/TestimonialModel');
const { listeners } = require('../../../models/orderDates');


function calculateAverage(data) {
    let total = 0;
    data.forEach(item => {
        total += item;
    })
    return parseInt(total / data.length);
}


function commonController() {
    return {
        getServiceByUserId: async (req, res) => {
            const document = await ServiceModel.findOne({ vendorId: req.user._id });
            if (!document) {
                return res.status(403).json({ message: 'No service found.' });
            }
            return res.status(200).json(document);
        },
        serviceById: async (req, res) => {
            const serviceId = req.body.id;
            const document = await ServiceModel.findById(serviceId);
            const feedbacks = await TestimonialModel.find({ serviceId: serviceId });
            if (!document) {
                return res.status(403).json({ message: 'No service found.' });

            }
            return res.status(200).json({ document, feedbacks });

        },
        getDates: async (req, res) => {
            const { id } = req.body;
            const serviceDate = await orderDates.findOne({ serviceId: id });
            let Dates = [];
            if (!serviceDate) {
                return res.json(Dates);
            }
            serviceDate.allDates.forEach((item) => {
                let time = item.time;
                item.dates.forEach(date => {
                    Dates.push({ date, time });
                })
            })
            return res.json(Dates);
        },
        updateBusinessInfo: async (req, res) => {

            const { serviceId, serviceName, coverPicture, city, town, province, contact_number } = req.body.values;
            const document = await ServiceModel.findOne({ _id: serviceId });
            if (!document) {
                return res.status(403).json({ message: 'No service found.' });
            }

            ServiceModel.findOneAndUpdate(
                { _id: serviceId },
                {
                    serviceName,
                    contact_number,
                    city,
                    province,
                    town,
                    coverPicture: req.body.url ? req.body.url : coverPicture
                },
                { new: true }, (err, document) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal server error' })
                    }

                    return res.json({ message: 'all ok' })
                }
            )
        },
        updatePackageInfo: async (req, res) => {
            const { basicPackage, standardPackage, serviceId, premiumPackage, basicPackageCost, standardPackageCost, premiumPackageCost } = req.body;
            const document = await ServiceModel.findOne({ _id: serviceId });
            if (!document) {
                return res.status(403).json({ message: 'No service found.' });
            }

            ServiceModel.findOneAndUpdate(
                { _id: serviceId },
                {
                    basicPackage,
                    standardPackage,
                    premiumPackage,
                    basicPackageCost,
                    standardPackageCost,
                    premiumPackageCost
                },
                { new: true }, (err, document) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: 'Internal server error' })
                    }

                    return res.json({ message: 'all ok' })
                }
            )
        },
        deleteGalleryPicture: async (req, res) => {
            try {
                const { serviceId, imageRef } = req.body;
                const document = await ServiceModel.findOne({ _id: serviceId });
                let galleries = document.galleryPictures;
                galleries = galleries.filter((item, index) => {
                    return item != imageRef
                })
                console.log(galleries);
                ServiceModel.findOneAndUpdate({ _id: serviceId },
                    { $set: { galleryPictures: galleries } },
                    { new: true }, function (err, doc) {
                        if (err) {
                            return res.status.json({ message: 'Internal server error' });
                        }
                        return res.json({ message: 'ok' })
                    });
            } catch (error) {
                console.log(error);
            }
        },
        dummyCalculation: async (req, res) => {
            try {
                const allServices = await ServiceModel.find({ status: 'approved' });
                const basicVenue = [];
                const standardVenue = [];
                const premiumVenue = [];
                const basicDecor = [];
                const standardDecor = [];
                const premiumDecor = [];
                const basicCatering = [];
                const standardCatering = [];
                const premiumCatering = [];
                const basicPhotographer = [];
                const standardPhotographer = [];
                const premiumPhotographer = [];
                const hallCharges = [];

                allServices.forEach((item) => {
                    if (item.serviceType == 'venue') {
                        hallCharges.push(item.hallCharges);
                        basicVenue.push(item.basicPackageCost);
                        standardVenue.push(item.standardPackageCost);
                        premiumVenue.push(item.premiumPackageCost);
                    }
                    else if (item.serviceType == 'decorator') {
                        basicDecor.push(item.basicPackageCost);
                        standardDecor.push(item.standardPackageCost);
                        premiumDecor.push(item.premiumPackageCost);
                    }
                    else if (item.serviceType == 'catering') {
                        basicCatering.push(item.basicPackageCost);
                        standardCatering.push(item.standardPackageCost);
                        premiumCatering.push(item.premiumPackageCost);
                    }
                    else {
                        basicPhotographer.push(item.basicPackageCost);
                        standardPhotographer.push(item.standardPackageCost);
                        premiumPhotographer.push(item.premiumPackageCost);
                    }
                })
                const averageVenueBasic = calculateAverage(basicVenue);
                const averageHallCharges = calculateAverage(hallCharges);
                const averageVenueStandard = calculateAverage(standardVenue);
                const averageVenuePremium = calculateAverage(premiumVenue);
                const averageCateringBasic = calculateAverage(basicCatering);
                const averageCateringStandard = calculateAverage(standardCatering);
                const averageCateringPremium = calculateAverage(premiumCatering);
                const averageDecorBasic = calculateAverage(basicDecor);
                const averageDecorStandard = calculateAverage(standardDecor);
                const averageDecorPremium = calculateAverage(premiumDecor);
                const averagePhotographerBasic = calculateAverage(basicPhotographer);
                const averagePhotographerStandard = calculateAverage(standardPhotographer);
                const averagePhotographerPremium = calculateAverage(premiumPhotographer);
                return res.json({ averageVenueBasic, averageVenueStandard, averageVenuePremium, averageCateringBasic, averageCateringStandard, averageCateringPremium, averageDecorBasic, averageDecorStandard, averageDecorPremium, averagePhotographerBasic, averagePhotographerStandard, averagePhotographerPremium, averageHallCharges })
            } catch (error) {
                return res.status(500).json({ message: error });
            }
        },
        items: async (req, res) => {
            try {
                const data = [
                    {
                        basicPackage: [
                            'rice',
                            'fruit',
                            'mango',
                            'channa'
                        ]
                    }, {
                        basicPackage: [
                            'rice',
                            'fruit',
                            'nano',
                            'orange'
                        ]
                    },
                    {
                        basicPackage: [
                            'grapghes',
                            'fruit',
                            'hahah',
                            'dhall'
                        ]
                    }
                ]

                let response = [];

                data.forEach((item) => {
                    item.basicPackage.forEach((ele) => {
                        response.push(ele);
                        response = Array.from(new Set(response))
                    })
                })

                console.log(response)
                return res.json({ response })
            } catch (error) {
                return res.status(500).json({ message: error });
            }
        }
    }
}

module.exports = commonController;
