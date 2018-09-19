import React from 'react';
import List from '@folio/stripes-components/lib/List';
import Checkbox from '../../../stripes-components/lib/Checkbox';


class ServicePointSelector extends React.Component {
  render() {
    const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];
    const itemFormatter = (item) => (
      <li>
        <Checkbox
          id={item}
          label={item}
        />
      </li>
    );
    const isEmptyMessage = 'No items to show';

    return (
      <List
        items={items}
        itemFormatter={itemFormatter}
        isEmptyMessage={isEmptyMessage}
      />
    );
  }
}

export default ServicePointSelector;
