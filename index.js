import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import UiCalendar from './UiCalendar';
import Settings from './settings';

class CalendarRouting extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.connectedApp = props.stripes.connect(UiCalendar);
  }

  NoMatch() {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>

How did you get to
          <tt>{this.props.location.pathname}</tt>

?
        </p>
      </div>
    );
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <this.connectedApp {...this.props} />}
        />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default CalendarRouting;
