import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from "moment";
import PropTypes from 'prop-types';

class BigCalendarWrapper extends React.Component {

    static propTypes = {
        onCalendarChange: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.onSlotSelect=this.onSlotSelect.bind(this);
        this.state={events:[]};
    }

    componentWillMount() {
        BigCalendar.momentLocalizer(moment);
    }

    onSlotSelect(lofasz) {
        console.log(lofasz);
        let that = this;
        this.setState(that.state.events.push(lofasz));
        console.log(this.state.events);
    }

    render() {
        const formats={
            dayHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd dddd', culture)
        };
        return (
            <div style={{height: "600px"}}>
                <BigCalendar
                    fromats={formats}
                    events={this.state.events}
                    defaultView="week"
                    selectable={true}
                    toolbar={false}
                    onSelectSlot={this.onSlotSelect}
                    onCalendarChange={event => alert(event)}
                />
            </div>);
    }

}

export default BigCalendarWrapper;