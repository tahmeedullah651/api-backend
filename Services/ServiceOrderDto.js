function ServiceOrderDto(user, order) {
    const orderData = {
        _id: user._id,
        customerName: user.fullName,
        startDate: order.startDate,
        endDate: order.endDate,
        eventTime: order.eventTime,
        status: order.orderStatus,
        contact: order.phone,
        totalCost: order.totalCost
    }
    return orderData;
}

module.exports = ServiceOrderDto;