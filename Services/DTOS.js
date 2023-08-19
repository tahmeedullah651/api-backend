class DTOS {
    dashbaordDto(revenue, pending, allOrder, recentClient) {
        return {
            totalOrders: allOrder,
            totalRevenue: revenue,
            requestedOrders: pending,
            customers: recentClient,
        }
    }

    userDto(user) {
        const userdata = {
            _id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone,
        }
        return userdata;
    }

    // generateCustomerOrderDetail(data) {
    //     return {
    //         serviceName: data.serviceName,
    //         customerName: data.customerName,
    //         charges: data.charges[0],
    //         totalCost: data.totalCost,
    //         startDate: data.startDate,
    //         endDate: data.endDate,
    //         eventTime: data.eventTime,
    //         persons: data.noOfPersons,
    //         serviceCharges: data.serviceId.hallCharges,
    //         internalCatering: data.serviceId.serviceList.internalCatering,
    //         internalFood: data.serviceId.serviceList.internalFood
    //     }
    // }
}

module.exports = new DTOS;