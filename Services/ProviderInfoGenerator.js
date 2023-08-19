class ProviderInfoGenerator {
    splitOrdersInformation(allOrders) {
        let totalPending = 0;
        let pendingOrdersData = [];
        let approvedOrders = [];
        let totalOrders = allOrders.length;
        let allOrdersData = allOrders;
        if (allOrders.length) {
            allOrders.forEach((order) => {
                if (order.orderStatus == 'pending') {
                    totalPending = totalPending + 1;
                    pendingOrdersData.push(order);
                }
                if (order.orderStatus == 'approved') {
                    approvedOrders.push(order);
                }
            })
        }
        return { totalPending, pendingOrdersData, approvedOrders, allOrdersData, totalOrders }
    }
    calculateTotalRevenue(ordersData) {
        let TotalRevenue = 0;
        ordersData.forEach((item) => {
            TotalRevenue = TotalRevenue + item.totalCost;
        })
        return TotalRevenue;
    }
    getRecentCustomers(allOrder) {
        const recentClient = [];
        allOrder.forEach((order) => {
            if (recentClient.length < 6) {
                recentClient.push({ customerName: order.customerName });
            }
        })
        return recentClient;
    }


};


module.exports = new ProviderInfoGenerator;