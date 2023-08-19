const ServiceModel = require("../../../models/ServiceModel");
const TestimonialModel = require("../../../models/TestimonialModel");
const User = require("../../../models/User");


function sumProperty(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum = sum + arr[i].starCount;
    }
    return sum;
}

async function manageRating(serviceId) {
    const preReviews = await TestimonialModel.find({ serviceId: serviceId });
    const result = sumProperty(preReviews);
    let average = result / preReviews.length;
    ServiceModel.findOneAndUpdate(
        { _id: serviceId },
        {
            rating: average
        },
        { new: true }, (err, document) => {
            if (err) {
                console.log('something went wrong');
                return;
            }
        }
    )
}

function reviewController() {
    return {
        addReview: async (req, res) => {
            const { serviceId, starCount, reviewMessage, userId } = req.body;
            if (!serviceId || !starCount || !reviewMessage || !userId) {
                return res.status(403).json({ message: 'All fields are required' });
            }
            const userData = await User.findById(userId);
            if (!userData) {
                return res.status(404).json({ message: 'Invalid user' });
            }

            const serviceData = await ServiceModel.findById(serviceId);
            if (!serviceData) {
                return res.status(404).json({ message: 'Invalid service provider' });
            }
            const isExist = await TestimonialModel.findOne({ userId: userData._id });
            if (isExist) {
                return res.status(403).json({ message: 'User can only add review once' })
            }
            try {
                const newReview = new TestimonialModel({
                    userId: userData._id,
                    serviceId: serviceData._id,
                    customerName: userData.fullName,
                    starCount: starCount,
                    message: reviewMessage
                });

                const result = await newReview.save();
                if (!result) {
                    return res.status(500).json({ message: 'Something Went wrong' });
                }
                manageRating(serviceId);
                return res.json(result);
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        },
        deleteReview: async (req, res) => {
            try {
                const document = await TestimonialModel.findOneAndDelete({ _id: req.body._id });
                if (!document) {
                    return res.status(404).json({ message: 'Could not find feedback' });
                }
                manageRating(document.serviceId);
                return res.status(200).json({ message: 'All ok' })
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        },
        updateReview: (req, res) => {
            TestimonialModel.findOneAndUpdate(
                { _id: req.body._id },
                {
                    starCount: req.body.starCount,
                    message: req.body.message
                },
                { new: true },
                (err, document) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    if (!document) {
                        return res.status(404).json({ message: 'Review not found.' });
                    }
                    manageRating(document.serviceId);
                    return res.json({ message: 'All ok' })
                })
        },
        getServiceReview: async (req, res) => {
            try {
                const document = await TestimonialModel.find({ _id: req.body.serviceid });
                if (!document) {
                    return res.status(403).json({ message: 'no review yet' })
                }
                return res.json(document);
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}

module.exports = reviewController;
