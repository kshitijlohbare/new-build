// Simple script to monitor all click events on the page
// You can paste this into your browser console to monitor events

document.addEventListener('click', function(event) {
  const target = event.target;
  const path = event.composedPath ? event.composedPath() : [];
  
  console.log('CLICK EVENT DETECTED on:', {
    target: target,
    tagName: target.tagName,
    id: target.id,
    className: target.className,
    eventPhase: event.eventPhase, // 1: capture, 2: target, 3: bubble
    defaultPrevented: event.defaultPrevented,
    path: path.slice(0, 5).map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className
    }))
  });
}, true); // Use capture phase to see all events

console.log('CLICK MONITOR ACTIVE: All click events will be logged');

// Optional - monitor pointer events too
document.addEventListener('pointerdown', function(event) {
  console.log('POINTER EVENT:', {
    type: event.type,
    target: event.target.tagName,
    id: event.target.id,
    className: event.target.className,
    pointerType: event.pointerType, // mouse, touch, pen
    isPrimary: event.isPrimary,
    preventDefault: event.defaultPrevented
  });
}, true);
