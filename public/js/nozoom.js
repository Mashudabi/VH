// Prevent pinch zoom and double-tap zoom on touch devices
(function(){
  // Helper: allow zoom gestures when target (or ancestor) is marked zoomable
  function isZoomAllowed(target){
    try{
      if(!target) return false;
      return !!target.closest && !!target.closest('.zoomable');
    }catch(e){ return false; }
  }

  // Prevent pinch/zoom (when two or more touch points) except on zoomable elements
  document.addEventListener('touchstart', function(e){
    if(e.touches && e.touches.length > 1){
      if(!isZoomAllowed(e.target)) e.preventDefault();
    }
  }, { passive: false });

  // Prevent double-tap to zoom except when tapping zoomable elements
  var lastTouch = 0;
  document.addEventListener('touchend', function(e){
    var now = (new Date()).getTime();
    if(now - lastTouch <= 300){
      if(!isZoomAllowed(e.target)) e.preventDefault();
    }
    lastTouch = now;
  }, { passive: false });

  // iOS gesturestart - allow if starting on zoomable element
  document.addEventListener('gesturestart', function (e) {
    if(!isZoomAllowed(e.target)) e.preventDefault();
  });

  // Set touch-action to manipulation for better behavior (does not disable zoom on zoomable elems)
  try {
    document.documentElement.style.touchAction = 'manipulation';
    document.body.style.touchAction = 'manipulation';
  } catch (err) {
    // ignore
  }
})();
