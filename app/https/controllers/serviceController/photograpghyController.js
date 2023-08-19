const ServiceModel = require('../../../models/ServiceModel');
const Joi = require("joi");

function photogrpghyController() {
    return {
        register: async (req, res) => {
            const { serviceName, contact_number, town, city, province, about, maleStaff, femaleStaff } = req.body.brand
            const venueSchema = Joi.object({
                serviceName: Joi.string().required(),
                contact_number: Joi.number().required(),
                town: Joi.string().required(),
                city: Joi.string().required(),
                province: Joi.string().required(),
                about: Joi.string().required(),
            })

            const { error } = venueSchema.validate({ serviceName, contact_number, town, city, province, about });
            if (error) {
                console.log(error);
                return res.status(422).json({ message: error.message });
            }
            const isExist = await ServiceModel.exists({ contact_number: req.body.brand.contact_number, serviceType: 'photogrpaghy' });
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
                const { coverPictureUrl, galleryPicturesUrl, basicPackage, standardPackage, premiumPackage } = req.body;
                const newVenue = new ServiceModel({
                    vendorId: req.user._id,
                    serviceName: serviceName,
                    contact_number: contact_number,
                    town: town,
                    serviceType: 'photogrpaghy',
                    city: city,
                    about: about,
                    province: province,
                    servicesList: {
                        maleStaff: maleStaff,
                        femaleStaff: femaleStaff
                    },
                    coverPicture: coverPictureUrl,
                    galleryPictures: galleryPicturesUrl,
                    basicPackage: basicPackage,
                    standardPackage: standardPackage,
                    premiumPackage: premiumPackage,
                    basicPackageCost: req.body.basicCost,
                    standardPackageCost: req.body.standardCost,
                    premiumPackageCost: req.body.premiumCost
                })

                const result = await newVenue.save();
                if (!result) {
                    console.log('hello from error')
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.status(200).json(result);
            } catch (error) {
                console.log(error)
                return res.status(500).json({ message: error.message })
            }
        },
        allPhotograpgher: async (req, res) => {
            const document = await ServiceModel.find({ status: 'approved', serviceType: 'photogrpaghy' });
            if (document.length < 1) {
                return res.status(403).json({ message: 'No photgrapgher found.' });
            }
            return res.status(201).json(document);
        }
    }
}

module.exports = photogrpghyController;