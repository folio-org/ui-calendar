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

  const mousedown = new MouseEvent('mousedown', {
    clientX: startX,
    clientY: startY,
    bubbles: true,
    cancelable: true,
    view: window
  });
  const mousemove = new MouseEvent('mousemove', {
    clientX: endX,
    clientY: endY,
    bubbles: true,
    cancelable: true,
    view: window
  });
  const mouseup = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  document.dispatchEvent(mousedown);
  document.dispatchEvent(mousemove);
  document.dispatchEvent(mouseup);
};
