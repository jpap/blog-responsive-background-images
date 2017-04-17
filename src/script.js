(function() {

// Clamp size to a maximum aspect ratio
function clampAspect(size, maxAspect) {
  var aspect = size.w / size.h;
  if (aspect > maxAspect) {
    size.w = size.h * maxAspect;
  }
  // Equivalent to if (aspect < (1.0 / maxAspect)),
  // where the ratio is reversed for the vertical.
  else if (aspect * maxAspect < 1.0) {
    // (We use a reversed ratio here too)
    size.h = size.w * maxAspect;
  }
  return size;
}

var onResize = function() {

  // Image size
  var imageSize = {
    w: 500, h: 200
  };
  // Image subject region
  var subjectRegion = {
    x: 162, y: 4,
    w: 154, h: 144
  };

  // Clamp viewport to 2:1 aspect
  var viewportSize = clampAspect({
    w: $(window).innerWidth(),
    h: $(window).innerHeight()
  }, 2.0);

  // Viewport target region
  var targetRegion = {
    x: 0.50 * viewportSize.w,
    y: 0.10 * viewportSize.h,
    w: 0.50 * viewportSize.w,
    h: 0.35 * viewportSize.h
  };

  // Subject region centroid
  var subject = {
    x: subjectRegion.x + (subjectRegion.w / 2),
    y: subjectRegion.y + (subjectRegion.h / 2)
  };
  // Target region centroid
  var target = {
    x: targetRegion.x + (targetRegion.w / 2),
    y: targetRegion.y + (targetRegion.h / 2)
  };

  // Optimal image scale, Eq. (7)
  var scale = Math.max(
    target.x / subject.x,
    target.y / subject.y,
    (viewportSize.w - target.x) / (imageSize.w - subject.x),
    (viewportSize.h - target.y) / (imageSize.h - subject.y)
  );
  // Optimal image position, Eq. (8)
  var pos = {
    x: target.x - scale * subject.x,
    y: target.y - scale * subject.y
  };

  if (0) {
    console.log("Drawing debug areas...");

    // Target area
    var dbg = $("#debug-red");
    dbg.offset({
      left: targetRegion.x,
      top: targetRegion.y
    });
    dbg.width(targetRegion.w);
    dbg.height(targetRegion.h);

    // Subject area
    var dbg = $("#debug-green");
    dbg.offset({
      left: pos.x + subjectRegion.x * scale,
      top:  pos.y + subjectRegion.y * scale
    });
    dbg.width(subjectRegion.w * scale);
    dbg.height(subjectRegion.h * scale);
  }

  // Position and scale the image with em-units
  var emS = parseFloat(
    $("body").css("font-size")
  );
  $("#background-image").css({
    width: (imageSize.w * scale / emS) + 'em',
    height: (imageSize.h * scale / emS) + 'em',
    left: (pos.x / emS) + 'em',
    top: (pos.y / emS) + 'em'
  });
};

$(onResize);
$(window).on("resize", onResize);

})();