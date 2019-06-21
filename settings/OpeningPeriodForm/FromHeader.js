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
import { IfPermission } from '@folio/stripes-core';

import { permissions } from '../constants';

const FromHeader = (props) => {
  const {
    modifyPeriod,
    onClose,
    handleDelete,
  } = props;
  const isPeriodFormNew = isEmpty(modifyPeriod);
  const [title, submitPermission] = isPeriodFormNew
    ? ['ui-calendar.regularLibraryValidityPeriod', permissions.POST]
    : ['ui-calendar.modifyRegularLibraryValidityPeriod', permissions.PUT];

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
          <IfPermission perm={permissions.DELETE}>
            <Button
              data-test-delete-button
              disabled={isPeriodFormNew}
              buttonStyle="danger"
              onClick={() => { handleDelete(); }}
            >
              <FormattedMessage id="ui-calendar.deleteButton" />
            </Button>
          </IfPermission>
          <IfPermission perm={submitPermission}>
            <Button
              data-test-save-button
              type="submit"
              buttonStyle="default"
            >
              <FormattedMessage id="ui-calendar.saveButton" />
            </Button>
          </IfPermission>
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
