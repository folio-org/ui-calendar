import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  noop,
  isEmpty,
} from 'lodash';

import {
  Button,
  Headline,
  IconButton,
  Row,
  Col,
} from '@folio/stripes/components';

const FromHeader = (props) => {
  const {
    modifyPeriod,
    onClose,
    handleDelete,
  } = props;
  const isPeriodFormNew = isEmpty(modifyPeriod);
  const title = isPeriodFormNew
    ? 'ui-calendar.regularLibraryValidityPeriod'
    : 'ui-calendar.modifyRegularLibraryValidityPeriod';

  return (
    <div data-test-opening-period-form-header>
      <Row>
        <Col
          data-test-close-button
          sm={3}
        >
          <IconButton
            onClick={onClose}
            icon="times"
            size="medium"
            iconClassName="closeIcon"
          />
        </Col>
        <Col
          data-test-title
          sm={6}
        >
          <Headline
            size="large"
            margin="medium"
            tag="h3"
          >
            <FormattedMessage id={title} />
          </Headline>
        </Col>
        <Col
          sm={3}
          className="new-period-buttons"
        >
          <Button
            data-test-delete-button
            disabled={isPeriodFormNew}
            buttonStyle="danger"
            onClick={() => { handleDelete(); }}
          >
            <FormattedMessage id="ui-calendar.deleteButton" />
          </Button>
          <Button
            data-test-save-button
            type="submit"
            buttonStyle="default"
          >
            <FormattedMessage id="ui-calendar.saveButton" />
          </Button>
          <Button
            data-test-save-as-template
            buttonStyle="primary"
            disabled
          >
            <FormattedMessage id="ui-calendar.savesAsTemplate" />
          </Button>
        </Col>
      </Row>
      <hr />
    </div>
  );
};

FromHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  modifyPeriod: PropTypes.object
};

FromHeader.defaultProps = {
  handleDelete: noop,
  modifyPeriod: {},
};

export default FromHeader;
