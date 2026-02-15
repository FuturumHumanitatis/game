/**
 * Median-cut color quantization.
 *
 * Public API (attached to window):
 *   quantize(pixels, numColors)  → [{r, g, b, hex}]
 *   nearestColor(px, palette)    → index
 */
(function () {
  "use strict";

  function rgbHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Median-cut quantization.
   * @param {number[][]} pixels  – flat array of [r,g,b] triples
   * @param {number}     n       – desired palette size
   * @returns {{r:number,g:number,b:number,hex:string}[]}
   */
  function quantize(pixels, n) {
    if (n < 1) n = 1;

    // Sub-sample large inputs
    var sample = pixels;
    if (pixels.length > 25000) {
      sample = [];
      var step = Math.floor(pixels.length / 25000);
      for (var i = 0; i < pixels.length; i += step) sample.push(pixels[i]);
    }

    var buckets = [sample.slice()];

    while (buckets.length < n) {
      // Find bucket × channel with the greatest range
      var bestB = -1, bestRange = -1, bestCh = 0;
      for (var b = 0; b < buckets.length; b++) {
        if (buckets[b].length < 2) continue;
        for (var ch = 0; ch < 3; ch++) {
          var mn = 255, mx = 0;
          for (var j = 0; j < buckets[b].length; j++) {
            var v = buckets[b][j][ch];
            if (v < mn) mn = v;
            if (v > mx) mx = v;
          }
          var range = mx - mn;
          if (range > bestRange) { bestRange = range; bestB = b; bestCh = ch; }
        }
      }
      if (bestRange <= 0) break;

      var bk = buckets[bestB];
      bk.sort(function (a, b) { return a[bestCh] - b[bestCh]; });
      var mid = bk.length >> 1;
      if (mid === 0) mid = 1;
      buckets.splice(bestB, 1, bk.slice(0, mid), bk.slice(mid));
    }

    // Average each bucket → palette entry
    var result = [];
    for (var k = 0; k < buckets.length; k++) {
      var bkt = buckets[k];
      var sr = 0, sg = 0, sb = 0;
      for (var p = 0; p < bkt.length; p++) {
        sr += bkt[p][0]; sg += bkt[p][1]; sb += bkt[p][2];
      }
      var len = bkt.length || 1;
      var rr = Math.round(sr / len);
      var gg = Math.round(sg / len);
      var bb = Math.round(sb / len);
      result.push({ r: rr, g: gg, b: bb, hex: rgbHex(rr, gg, bb) });
    }

    // Sort by luminance for nicer ordering
    result.sort(function (a, b) {
      return (0.299 * a.r + 0.587 * a.g + 0.114 * a.b) -
             (0.299 * b.r + 0.587 * b.g + 0.114 * b.b);
    });

    return result;
  }

  /**
   * Find index of the nearest palette color (Euclidean in RGB).
   */
  function nearestColor(px, pal) {
    var best = 0, bestD = Infinity;
    for (var i = 0; i < pal.length; i++) {
      var dr = px[0] - pal[i].r;
      var dg = px[1] - pal[i].g;
      var db = px[2] - pal[i].b;
      var d = dr * dr + dg * dg + db * db;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  // Expose
  window.quantize = quantize;
  window.nearestColor = nearestColor;
})();
