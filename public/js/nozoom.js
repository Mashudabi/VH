// Prevent pinch zoom and double-tap zoom on touch devices
(function(){
  // Prevent pinch/zoom (when two or more touch points)
  document.addEventListener('touchstart', function(e){
    if(e.touches && e.touches.length > 1){
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent double-tap to zoom
  var lastTouch = 0;
  document.addEventListener('touchend', function(e){
    var now = (new Date()).getTime();
    if(now - lastTouch <= 300){
      e.preventDefault();
    }
    lastTouch = now;
  }, { passive: false });

  // iOS gesturestart
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });

  // Set touch-action to manipulation for better behavior
  try {
    document.documentElement.style.touchAction = 'manipulation';
    document.body.style.touchAction = 'manipulation';
  } catch (err) {
    // ignore
  }
})();
