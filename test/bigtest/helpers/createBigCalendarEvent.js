export default (startElement, endElement) => {
  const {
    x: startX,
    y: startY,
  } = startElement.$root.getBoundingClientRect();
  const {
    x: endX,
    y: endY,
  } = endElement.$root.getBoundingClientRect();

  const mousedown = new MouseEvent('mousedown', {
    clientX: startX + 10,
    clientY: startY + 10,
    bubbles: true,
    cancelable: true,
    view: window
  });
  const mousemove = new MouseEvent('mousemove', {
    clientX: endX + 10,
    clientY: endY + 10,
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
