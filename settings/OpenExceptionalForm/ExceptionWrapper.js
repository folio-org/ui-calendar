import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import RandomColor from 'randomcolor';
import ServicePointSelector from './ServicePointSelector';


class ExceptionWrapper extends React.Component {
    static propTypes = {
      entries: PropTypes.object,
    };

    constructor() {
      super();
      this.setServicePoints = this.setServicePoints.bind(this);
      this.handleServicePointChange = this.handleServicePointChange.bind(this);
      this.setState({
        servicePoints: []
      });
    }

    componentWillMount() {
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];
      const colors = [10];
      for (let i = 0; i < 10; i++) {
        colors[i] = RandomColor({
          luminosity: 'random',
          hue: 'random'
        });
      }
      for (let i = 0; i < this.props.entries.length; i++) {
        const tempSP = {
          id: this.props.entries[i].id,
          name: this.props.entries[i].name,
          selected: false,
          color: colors[i],
        };
        tempServicePoints[i] = tempSP;
      }
      this.setServicePoints(tempServicePoints);
    }

    setServicePoints(sps) {
      this.setState({
        servicePoints: sps,
      });
    }

    handleServicePointChange(sp) {
      const tempServicePoints = this.state.servicePoints;
      for (let i = 0; i < tempServicePoints.length; i++) {
        if (tempServicePoints[i].id === sp.id) {
          tempServicePoints.selected = sp.selected;
        }
      }
      this.setServicePoints(tempServicePoints);
    }

    render() {
      return (

        <Paneset>
          <Pane defaultWidth="30%" paneTitle="Filters">
            <ServicePointSelector
              {...this.props}
              handleServicePointChange={this.handleServicePointChange}
              setServicePoints={this.setServicePoints}
              servicePoints={this.state.servicePoints}
            />
          </Pane>

          <Pane defaultWidth="fill" paneTitle="Search Results" />
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
