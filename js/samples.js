/**
 * Procedurally-generated sample pictures.
 *
 * Each entry: { name, fn(w,h) → canvas }
 * Exposed as window.SAMPLES
 */
(function () {
  "use strict";

  function makeCvs(w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
  }

  var SAMPLES = [
    {
      name: "Закат",
      fn: function (w, h) {
        var c = makeCvs(w, h), ctx = c.getContext("2d");
        var g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#1a237e"); g.addColorStop(0.3, "#e65100");
        g.addColorStop(0.5, "#ff6f00"); g.addColorStop(0.6, "#ffab00");
        g.addColorStop(0.65, "#1b5e20"); g.addColorStop(1, "#2e7d32");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff176";
        ctx.beginPath(); ctx.arc(w / 2, h * 0.45, h * 0.15, 0, Math.PI * 2); ctx.fill();
        return c;
      }
    },
    {
      name: "Радуга",
      fn: function (w, h) {
        var c = makeCvs(w, h), ctx = c.getContext("2d");
        ctx.fillStyle = "#87ceeb"; ctx.fillRect(0, 0, w, h);
        var cols = ["#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#3949ab", "#8e24aa"];
        var bH = h * 0.08;
        for (var i = 0; i < cols.length; i++) {
          ctx.strokeStyle = cols[i]; ctx.lineWidth = bH;
          var rad = w * 0.35 - i * bH;
          if (rad > 0) { ctx.beginPath(); ctx.arc(w / 2, h * 0.9, rad, Math.PI, 0); ctx.stroke(); }
        }
        ctx.fillStyle = "#4caf50"; ctx.fillRect(0, h * 0.82, w, h * 0.18);
        return c;
      }
    },
    {
      name: "Горы",
      fn: function (w, h) {
        var c = makeCvs(w, h), ctx = c.getContext("2d");
        ctx.fillStyle = "#87ceeb"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#78909c";
        ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w * 0.25, h * 0.2);
        ctx.lineTo(w * 0.5, h * 0.55); ctx.lineTo(w * 0.5, h); ctx.fill();
        ctx.fillStyle = "#546e7a";
        ctx.beginPath(); ctx.moveTo(w * 0.3, h); ctx.lineTo(w * 0.6, h * 0.15);
        ctx.lineTo(w * 0.9, h * 0.5); ctx.lineTo(w, h); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.moveTo(w * 0.55, h * 0.17); ctx.lineTo(w * 0.6, h * 0.15);
        ctx.lineTo(w * 0.65, h * 0.17); ctx.lineTo(w * 0.63, h * 0.25);
        ctx.lineTo(w * 0.57, h * 0.25); ctx.fill();
        ctx.fillStyle = "#4caf50"; ctx.fillRect(0, h * 0.75, w, h * 0.25);
        return c;
      }
    },
    {
      name: "Цветок",
      fn: function (w, h) {
        var c = makeCvs(w, h), ctx = c.getContext("2d");
        ctx.fillStyle = "#e8f5e9"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#388e3c"; ctx.fillRect(w * 0.47, h * 0.55, w * 0.06, h * 0.4);
        for (var a = 0; a < 6; a++) {
          ctx.save(); ctx.translate(w / 2, h * 0.4); ctx.rotate(a * Math.PI / 3);
          ctx.fillStyle = a % 2 ? "#e91e63" : "#f06292";
          ctx.beginPath(); ctx.ellipse(0, -h * 0.14, w * 0.08, h * 0.14, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = "#fdd835";
        ctx.beginPath(); ctx.arc(w / 2, h * 0.4, w * 0.08, 0, Math.PI * 2); ctx.fill();
        return c;
      }
    },
    {
      name: "Мозаика",
      fn: function (w, h) {
        var c = makeCvs(w, h), ctx = c.getContext("2d");
        var cl = ["#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#8e24aa", "#00897b", "#f4511e"];
        var s = Math.ceil(w / 6);
        for (var y = 0; y < h; y += s) {
          for (var x = 0; x < w; x += s) {
            ctx.fillStyle = cl[(Math.floor(x / s) + Math.floor(y / s) * 3) % cl.length];
            ctx.fillRect(x, y, s, s);
          }
        }
        return c;
      }
    },
    {
      name: "Сердце",
      fn: function (w, h) {
        var c = makeCvs(w, h), ctx = c.getContext("2d");
        ctx.fillStyle = "#fff3e0"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#e53935";
        ctx.beginPath();
        var cx = w / 2, cy = h * 0.42, sz = w * 0.28;
        ctx.moveTo(cx, cy + sz * 0.9);
        ctx.bezierCurveTo(cx - sz * 1.5, cy - sz * 0.2, cx - sz * 0.8, cy - sz * 1.2, cx, cy - sz * 0.4);
        ctx.bezierCurveTo(cx + sz * 0.8, cy - sz * 1.2, cx + sz * 1.5, cy - sz * 0.2, cx, cy + sz * 0.9);
        ctx.fill();
        return c;
      }
    }
  ];

  window.SAMPLES = SAMPLES;
})();
