const getClickCoordinate = (element) => {
  const {
    x,
    y,
    height,
    width,
  } = element.$root.getBoundingClientRect();

  return {
    x: x + width / 2,
    y: y + height / 2,
  };
};

export default (startElement, endElement) => {
  const {
    x: startX,
    y: startY,
  } = getClickCoordinate(startElement);
  const {
    x: endX,
    y: endY,
  } = getClickCoordinate(endElement);

  const startEventData = {
    clientX: startX,
    clientY: startY,
    bubbles: true,
    cancelable: true,
    view: window
  };

  const endEventData = {
    clientX: endX,
    clientY: endY,
    bubbles: true,
    cancelable: true,
    view: window
  };

  startElement.$root.dispatchEvent(new MouseEvent('mousedown', startEventData));
  endElement.$root.dispatchEvent(new MouseEvent('mousemove', endEventData));
  endElement.$root.dispatchEvent(new MouseEvent('mouseup', endEventData));
};
