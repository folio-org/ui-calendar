import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import {
  Checkbox,
  List,
} from '@folio/stripes/components';

import '!style-loader!css-loader!../../css/exception-form.css'; // eslint-disable-line

const ServicePointSelector = (props) => {
  const {
    intl: {
      formatMessage,
    },
    servicePoints: items,
    handleServicePointChange,
  } = props;

  const onToggleSelect = (event) => {
    event.selected = !event.selected;
    handleServicePointChange(event);
  };

  const itemFormatter = (item) => (
    <li>
      <div
        className="CircleDiv"
        style={{ background: item.color }}
      />
      <Checkbox
        id={item.id}
        label={item.name}
        checked={item.selected}
        onChange={() => onToggleSelect(item)}
        fullWidth
      />
    </li>
  );

  return (
    <List
      items={items}
      itemFormatter={itemFormatter}
      isEmptyMessage={formatMessage({ id: 'ui-calendar.isEmptyMessage' })}
    />
  );
};

ServicePointSelector.propTypes = {
  intl: intlShape.isRequired,
  servicePoints: PropTypes.object.isRequired,
  handleServicePointChange: PropTypes.func.isRequired,
};

export default injectIntl(ServicePointSelector);
