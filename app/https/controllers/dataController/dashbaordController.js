const DTOS = require("../../../../Services/DTOS");
const ProviderInfoGenerator = require("../../../../Services/ProviderInfoGenerator");
const CustomerOrder = require("../../../models/CustomerOrder");
const ServiceModel = require("../../../models/ServiceModel");
const TestimonialModel = require("../../../models/TestimonialModel");

function dashbaordController() {
    return {
        dashbaord: async (req, res) => {
            const chartData = {
                highBudget: 20,
                lowBudget: 3,
                mediumBudget: 13
            }
            try {
                const isServiceExist = await ServiceModel.findOne({ vendorId: req.user._id });
                if (!isServiceExist) {
                    return res.status(404).json({ message: "User has not registered any service" });
                }
                const serviceOrders = await CustomerOrder.find({ serviceId: isServiceExist._id });
                serviceOrders.forEach((order) => {
                    if (order.totalCost > 950000) {
                        chartData.highBudget = chartData.highBudget + 1;
                    } else if (order.totalCost > 550000 && order.totalCost < 950000) {
                        chartData.mediumBudget = chartData.mediumBudget + 1;
                    } else {
                        chartData.lowBudget = chartData.lowBudget + 1;
                    }
                })
                const feedbacks = await TestimonialModel.find({ serviceId: isServiceExist._id })
                const totalRevenue = ProviderInfoGenerator.calculateTotalRevenue(serviceOrders);
                const { totalPending, pendingOrdersData, totalOrders, allOrdersData, approvedOrders } = ProviderInfoGenerator.splitOrdersInformation(serviceOrders);
                const allcustomer = ProviderInfoGenerator.getRecentCustomers(serviceOrders);
                const uniqueCustomersSet = new Set(allcustomer.map((customer) => JSON.stringify(customer)));
                const recentCustomers = Array.from(uniqueCustomersSet).map((customer) => JSON.parse(customer));

                const dashbaordData = DTOS.dashbaordDto(totalRevenue, totalPending, totalOrders, recentCustomers)
                return res.json({ dashbaordData, isServiceExist, serviceOrders, pendingOrdersData, allOrdersData, approvedOrders, chartData });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}

module.exports = dashbaordController;