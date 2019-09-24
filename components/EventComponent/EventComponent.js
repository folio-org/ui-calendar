import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@folio/stripes/components';

import css from './EventComponent.css';

const EventComponent = memo(({ title, event, onDeleteEvent }) => {
  const onClick = () => {
    onDeleteEvent(event);
  };

  return (
    <div className={css.container}>
      {title}
      <IconButton
        className={css.resetButton}
        innerClassName={css.icon}
        icon="times-circle-solid"
        onClick={onClick}
      />
    </div>
  );
});

EventComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
};

export default EventComponent;
