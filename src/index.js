import React from "react";
import { hot } from "react-hot-loader";
import PropTypes from "prop-types";
import Settings from "./settings";

class CalendarRouting extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  };

  NoMatch() {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>
          How did you get to
          {this.props.location.pathname}?
        </p>
      </div>
    );
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return this.NoMatch();
  }
}

export default hot(module)(CalendarRouting);
