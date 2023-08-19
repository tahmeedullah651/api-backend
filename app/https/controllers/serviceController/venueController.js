const ServiceModel = require('../../../models/ServiceModel');
const orderDates = require('../../../models/orderDates');
const Joi = require("joi");


function venueController() {
    return {

        register: async (req, res) => {
            const venueSchema = Joi.object({
                serviceName: Joi.string().required(),
                contact_number: Joi.number().required(),
                town: Joi.string().required(),
                city: Joi.string().required(),
                province: Joi.string().required(),
                about: Joi.string().required(),
            })

            const { error } = venueSchema.validate(req.body.brand);
            if (error) {
                return res.status(422).json({ message: error.message });
            }
            const isExist = await ServiceModel.exists({ contact_number: req.body.brand.contact_number, serviceType: 'venue' });
            if (isExist) {
                return res.status(409).json({ message: 'Phone number has been already registered' });
            }
            if (!req.body.coverPictureUrl) {
                return res.status(409).json({ message: 'Cover picture is required' });
            }
            if (!req.body.galleryPicturesUrl) {
                return res.status(409).json({ message: 'Gallery picture are required' });
            }
            try {
                const { brand, services, coverPictureUrl, galleryPicturesUrl, basicPackage, standardPackage, premiumPackage } = req.body;
                const newVenue = new ServiceModel({
                    vendorId: req.user._id,
                    serviceName: brand.serviceName,
                    contact_number: brand.contact_number,
                    town: brand.town,
                    serviceType: 'venue',
                    city: brand.city,
                    about: brand.about,
                    province: brand.province,
                    servicesList: services,
                    coverPicture: coverPictureUrl,
                    galleryPictures: galleryPicturesUrl,
                    basicPackage: basicPackage,
                    standardPackage: standardPackage,
                    premiumPackage: premiumPackage,
                    basicPackageCost: req.body.basicCost,
                    standardPackageCost: req.body.standardCost,
                    premiumPackageCost: req.body.premiumCost,
                    hallCharges: services.hallCharges
                })

                const result = await newVenue.save();
                if (!result) {
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.status(200).json(result);
            } catch (error) {
                return res.status(500).json({ message: error.message })
            }
        },
        allVenues: async (req, res) => {
            const document = await ServiceModel.find({ status: 'approved', serviceType: 'venue' });
            if (document.length < 1) {
                return res.status(403).json({ message: 'No venue found.' });
            }
            return res.status(201).json(document);
        },
        venueById: async (req, res) => {
            const serviceId = req.body.id;
            const document = await ServiceModel.findById(serviceId);
            if (!document) {
                return res.status(403).json({ message: 'No venue found.' });

            }
            return res.status(200).json(document);

        },
    }
}

module.exports = venueController;