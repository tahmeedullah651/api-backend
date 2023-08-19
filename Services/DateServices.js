class DateServices {

    static generateDate(startDate, endDate) {
        let Dates = [];
        let date = new Date(startDate);
        let enddate = new Date(endDate);
        Dates = [...Dates, new Date(startDate)];
        while (date < enddate) {
            Dates = [...Dates, date];
            date = new Date(date.setDate(date.getDate() + 1));
        }

        return Dates;
    }

    static removeDates(allDates, startDate, endDate, eventTime) {
        const generatedDates = this.generateDate(startDate, endDate);
        let generatedMarkup = {
            dates: generatedDates,
            time: eventTime
        }

        const newDates = [];
        allDates.some((item) => {
            if (JSON.stringify(item) != JSON.stringify(generatedMarkup)) {
                newDates.push(item);
            }
        });

        return newDates;
    }

    static checkDate(service, startDate, eventTime) {
        let isUniqueDate = true;
        service.allDates.forEach((orderDates) => {
            const toBeRegistered = new Date(startDate);
            if (orderDates.dates.length > 1) {
                orderDates.dates.forEach(element => {
                    if (element.toString() === toBeRegistered.toString()) {
                        isUniqueDate = false;
                    }
                });
            } else {
                if (orderDates.dates.toString() == toBeRegistered.toString() && orderDates.time == eventTime) {
                    isUniqueDate = false;
                }
            }
        })

        return isUniqueDate;
    }


};


module.exports = DateServices;