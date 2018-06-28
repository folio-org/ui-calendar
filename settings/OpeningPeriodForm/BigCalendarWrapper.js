import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from "moment";

class BigCalendarWrapper extends React.Component {

    constructor() {
        super();

    }

    componentWillMount() {
        BigCalendar.momentLocalizer(moment);
    }

    render() {
        const formats={
            dayHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd dddd', culture)
        };
        return (
            <div style={{height: "1000px"}}>
                <BigCalendar  fromats={formats}    events={[]} defaultView="week"  selectable={true} toolbar={false}   />
            </div>);
    }

}

export default BigCalendarWrapper;