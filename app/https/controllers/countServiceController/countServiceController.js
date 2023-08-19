const ServiceModel = require("../../../models/ServiceModel");

function countServiceControlller() {
    return {
        index: async (req, res) => {
            // venue
            // decorator
            //catering
            // photogrpaghy

            const serviceData = {
                Venues: 0,
                Cateror: 0,
                Decor: 0,
                Photographer: 0
            }

            try {
                const data = await ServiceModel.find({ status: "approved" });
                data.forEach((ele) => {
                    if (ele.serviceType === "venue") {
                        serviceData.Venues = serviceData.Venues + 1;
                    } else if (ele.serviceType === "decorator") {
                        serviceData.Decor = serviceData.Decor + 1;
                    } else if (ele.serviceType === "catering") {
                        serviceData.Cateror = serviceData.Cateror + 1;
                    } else {
                        serviceData.Photographer = serviceData.Photographer + 1
                    }
                })

                return res.status(200).json(serviceData);
            } catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        }
    }

}

module.exports = countServiceControlller;