import React from 'react';
import moment from "moment";

class CalendarUtils extends React.Component {

    static convertNewPeriodToValidBackendPeriod(period,event){
        let weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        let weekDay = 8;
        let openingHour = [];
        let sortedEvents = [];
        if (event) {
            sortedEvents = event.sort(function (a, b) {
                return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
            });
        }
        for (let i = 0; i < sortedEvents.length; i++) {
            let dayOpening = sortedEvents[i];
            if(dayOpening.start instanceof moment){
                dayOpening.start= moment(dayOpening.start).toDate();
                dayOpening.end= moment(dayOpening.end).toDate();
            }
            if (weekDay !== dayOpening.start.getDay()) {
                weekDay = dayOpening.start.getDay();
                openingHour = [];
                if (dayOpening.allDay) {
                    period.openingDays.push({
                        weekdays: {
                            day: weekDays[weekDay],
                        },
                        openingDay: {
                            allDay: dayOpening.allDay,
                            open: true
                        }
                    });
                } else {
                    period.openingDays.push({
                        weekdays: {
                            day: weekDays[weekDay],
                        },
                        openingDay: {
                            openingHour: openingHour,
                            allDay: dayOpening.allDay,
                            open: true
                        }
                    });
                }
            }
            openingHour.push({
                startTime: dayOpening.start.getHours() + ":" + dayOpening.start.getMinutes(),
                endTime: dayOpening.end.getHours() + ":" + dayOpening.end.getMinutes()
            });
        }
        return period;
    }

    static convertBackendPeriodToFrontend(){

    }


}

export default CalendarUtils;
