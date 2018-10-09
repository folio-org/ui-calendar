import React from 'react';
import { Button, Headline, IconButton, Row, Col } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import CalendarUtils from '../../CalendarUtils';

class FromHeader extends React.Component {
    static propTypes = {
      onClose: PropTypes.func.isRequired,
      handleDelete: PropTypes.func,
      modifyPeriod: PropTypes.object
    };

    render() {
      let disabled;
      if (this.props.modifyPeriod) {
        disabled = <Button onClick={() => { this.props.handleDelete(); }} buttonStyle="danger">{CalendarUtils.translate('ui-calendar.deleteButton')}</Button>;
      } else {
        disabled = <Button disabled onClick={() => { this.props.handleDelete(); }} buttonStyle="danger">{CalendarUtils.translate('ui-calendar.deleteButton')}</Button>;
      }
      let title;
      if (this.props.modifyPeriod) {
        title =
          <Headline size="large" margin="medium" tag="h3">
            {CalendarUtils.translate('ui-calendar.modifyRegularLibraryValidityPeriod')}
          </Headline>;
      } else {
        title =
          <Headline size="large" margin="medium" tag="h3">
            {CalendarUtils.translate('ui-calendar.regularLibraryValidityPeriod')}
          </Headline>;
      }

      return (


        <div>
          <Row>
            <Col sm={3}>
              <IconButton
                onClick={this.props.onClose}
                icon="closeX"
                size="medium"
                iconClassName="closeIcon"
              />
            </Col>
            <Col sm={6}>
              {title}
            </Col>
            <Col sm={3} className="new-period-buttons">

              {disabled}
              <Button type="submit" buttonStyle="default">{CalendarUtils.translate('ui-calendar.saveButton')}</Button>
              <Button disabled buttonStyle="primary">{CalendarUtils.translate('ui-calendar.savesAsTemplate')}</Button>

            </Col>
          </Row>
          <hr />
        </div>
      );
    }
}

export default FromHeader;
