/**
 * Main game logic – wires up upload, image processing, rendering and interaction.
 * Depends on: quantize.js (window.quantize, window.nearestColor)
 *             samples.js  (window.SAMPLES)
 */
(function () {
  "use strict";

  /* ================================================================
     DOM references
     ================================================================ */
  var menuScreen   = document.getElementById("menu-screen");
  var gameScreen   = document.getElementById("game-screen");
  var uploadArea   = document.getElementById("upload-area");
  var fileInput    = document.getElementById("file-input");
  var setColors    = document.getElementById("set-colors");
  var valColors    = document.getElementById("val-colors");
  var setGrid      = document.getElementById("set-grid");
  var valGrid      = document.getElementById("val-grid");
  var samplesGrid  = document.getElementById("samples-grid");
  var gameCanvas   = document.getElementById("game-canvas");
  var canvasWrap   = document.getElementById("canvas-wrap");
  var paletteEl    = document.getElementById("palette");
  var progressText = document.getElementById("progress-text");
  var progressFill = document.getElementById("progress-fill");
  var completionEl = document.getElementById("completion");
  var btnBack      = document.getElementById("btn-back");
  var btnNew       = document.getElementById("btn-new");
  var zoomInBtn    = document.getElementById("zoom-in");
  var zoomOutBtn   = document.getElementById("zoom-out");
  var zoomFitBtn   = document.getElementById("zoom-fit");
  var loadingEl    = document.getElementById("loading");

  /* ================================================================
     Game state
     ================================================================ */
  var grid        = [];   // [row][col] = paletteIndex
  var palColors   = [];   // [{r,g,b,hex}]
  var filled      = [];   // [row][col] = bool
  var rows        = 0;
  var cols        = 0;
  var CELL        = 14;   // px per cell when drawing on canvas
  var selectedIdx = -1;
  var zoomLevel   = 1;
  var totalCells  = 0;
  var doneCells   = 0;

  /* ================================================================
     Settings sliders
     ================================================================ */
  setColors.addEventListener("input", function () { valColors.textContent = setColors.value; });
  setGrid.addEventListener("input", function () { valGrid.textContent = setGrid.value; });

  /* ================================================================
     File upload (click + drag-and-drop)
     ================================================================ */
  uploadArea.addEventListener("click", function () { fileInput.click(); });
  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault(); uploadArea.classList.add("drag-over");
  });
  uploadArea.addEventListener("dragleave", function () {
    uploadArea.classList.remove("drag-over");
  });
  uploadArea.addEventListener("drop", function (e) {
    e.preventDefault(); uploadArea.classList.remove("drag-over");
    var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.indexOf("image") === 0) loadFile(file);
  });
  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) loadFile(fileInput.files[0]);
  });

  function loadFile(file) {
    var reader = new FileReader();
    reader.onload = function (e) { processImageSrc(e.target.result); };
    reader.readAsDataURL(file);
  }

  function processImageSrc(src) {
    loadingEl.classList.remove("hidden");
    var img = new Image();
    img.onload = function () {
      // Use setTimeout so the loading overlay can paint first
      setTimeout(function () {
        buildFromImage(img, parseInt(setColors.value, 10), parseInt(setGrid.value, 10));
        loadingEl.classList.add("hidden");
      }, 60);
    };
    img.onerror = function () {
      loadingEl.classList.add("hidden");
    };
    img.src = src;
  }

  /* ================================================================
     Image → coloring-grid pipeline
     ================================================================ */

  function buildFromImage(img, numColors, gridMax) {
    // 1. Grid dimensions (keep aspect ratio)
    var aspect = img.width / img.height;
    if (aspect >= 1) {
      cols = gridMax;
      rows = Math.max(1, Math.round(gridMax / aspect));
    } else {
      rows = gridMax;
      cols = Math.max(1, Math.round(gridMax * aspect));
    }

    // 2. Down-sample to grid size via a hidden canvas
    var hc = document.createElement("canvas");
    hc.width = cols; hc.height = rows;
    var hctx = hc.getContext("2d");
    hctx.imageSmoothingEnabled = true;
    hctx.drawImage(img, 0, 0, cols, rows);
    var data = hctx.getImageData(0, 0, cols, rows).data;

    // 3. Collect pixel colours
    var pixels = [];
    for (var i = 0; i < data.length; i += 4) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }

    // 4. Quantize colours
    palColors = window.quantize(pixels, numColors);

    // 5. Map each pixel → nearest palette index
    grid = [];
    for (var r = 0; r < rows; r++) {
      grid[r] = [];
      for (var c = 0; c < cols; c++) {
        grid[r][c] = window.nearestColor(pixels[r * cols + c], palColors);
      }
    }

    // 6. Init filled state
    filled = [];
    for (var r2 = 0; r2 < rows; r2++) {
      filled[r2] = [];
      for (var c2 = 0; c2 < cols; c2++) filled[r2][c2] = false;
    }

    totalCells = rows * cols;
    doneCells = 0;
    selectedIdx = -1;
    zoomLevel = 1;
    canvasWrap.classList.remove("zoomed");

    startGame();
  }

  /* ================================================================
     Start / show game
     ================================================================ */

  function startGame() {
    completionEl.classList.add("hidden");
    renderPalette();
    drawCanvas();
    updateProgress();
    showScreen(gameScreen);
  }

  function showScreen(s) {
    menuScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    s.classList.add("active");
  }

  /* ================================================================
     Palette rendering
     ================================================================ */

  function renderPalette() {
    paletteEl.innerHTML = "";
    for (var i = 0; i < palColors.length; i++) {
      (function (idx) {
        var item = document.createElement("div");
        item.className = "palette-item";
        item.setAttribute("data-idx", idx);

        var sw = document.createElement("div");
        sw.className = "swatch";
        sw.style.backgroundColor = palColors[idx].hex;

        var nm = document.createElement("span");
        nm.className = "pnum";
        nm.textContent = idx + 1;

        var ck = document.createElement("span");
        ck.className = "done-check";
        ck.id = "pal-check-" + idx;

        item.appendChild(sw);
        item.appendChild(nm);
        item.appendChild(ck);
        item.addEventListener("click", function () { selectPaletteColor(idx); });
        paletteEl.appendChild(item);
      })(i);
    }
  }

  function selectPaletteColor(idx) {
    selectedIdx = idx;
    var items = paletteEl.querySelectorAll(".palette-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("selected", parseInt(items[i].getAttribute("data-idx"), 10) === idx);
    }
    drawCanvas();
  }

  /* ================================================================
     Canvas drawing
     ================================================================ */

  function drawCanvas() {
    var w = cols * CELL;
    var h = rows * CELL;
    gameCanvas.width = w;
    gameCanvas.height = h;
    var ctx = gameCanvas.getContext("2d");

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var ci = grid[r][c];
        var x = c * CELL, y = r * CELL;
        var p = palColors[ci];

        if (filled[r][c]) {
          ctx.fillStyle = p.hex;
          ctx.fillRect(x, y, CELL, CELL);
        } else {
          // Light tint so regions are hinted
          ctx.fillStyle = "rgba(" + p.r + "," + p.g + "," + p.b + ",0.12)";
          ctx.fillRect(x, y, CELL, CELL);

          // Highlight cells matching selected colour
          if (ci === selectedIdx) {
            ctx.fillStyle = "rgba(" + p.r + "," + p.g + "," + p.b + ",0.3)";
            ctx.fillRect(x, y, CELL, CELL);
          }

          // Number label
          if (CELL >= 10) {
            ctx.fillStyle = "#555";
            ctx.font = "bold " + Math.max(8, CELL * 0.55) + "px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(ci + 1), x + CELL / 2, y + CELL / 2 + 1);
          }
        }

        // Thin grid line
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, CELL, CELL);
      }
    }

    // Thick borders between different-colour neighbours
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1.2;
    for (var r2 = 0; r2 < rows; r2++) {
      for (var c2 = 0; c2 < cols; c2++) {
        var ci2 = grid[r2][c2];
        var x2 = c2 * CELL, y2 = r2 * CELL;
        if (c2 < cols - 1 && grid[r2][c2 + 1] !== ci2) {
          ctx.beginPath(); ctx.moveTo(x2 + CELL, y2); ctx.lineTo(x2 + CELL, y2 + CELL); ctx.stroke();
        }
        if (r2 < rows - 1 && grid[r2 + 1][c2] !== ci2) {
          ctx.beginPath(); ctx.moveTo(x2, y2 + CELL); ctx.lineTo(x2 + CELL, y2 + CELL); ctx.stroke();
        }
      }
    }
  }

  /* ================================================================
     Fill cells on click / drag
     ================================================================ */

  var isDrawing = false;

  gameCanvas.addEventListener("mousedown", function (e) { isDrawing = true; fillAtEvent(e); });
  gameCanvas.addEventListener("mousemove", function (e) { if (isDrawing) fillAtEvent(e); });
  window.addEventListener("mouseup", function () { isDrawing = false; });

  gameCanvas.addEventListener("touchstart", function (e) { isDrawing = true; fillAtTouch(e); }, { passive: false });
  gameCanvas.addEventListener("touchmove", function (e) { if (isDrawing) fillAtTouch(e); }, { passive: false });
  window.addEventListener("touchend", function () { isDrawing = false; });

  function canvasCoords(clientX, clientY) {
    var rect = gameCanvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (gameCanvas.width / rect.width),
      y: (clientY - rect.top) * (gameCanvas.height / rect.height)
    };
  }

  function fillAtEvent(e) {
    var pos = canvasCoords(e.clientX, e.clientY);
    fillAt(pos.x, pos.y);
  }

  function fillAtTouch(e) {
    e.preventDefault();
    var t = e.touches[0];
    if (!t) return;
    var pos = canvasCoords(t.clientX, t.clientY);
    fillAt(pos.x, pos.y);
  }

  function fillAt(mx, my) {
    if (selectedIdx < 0) return;
    var c = Math.floor(mx / CELL);
    var r = Math.floor(my / CELL);
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (filled[r][c]) return;
    if (grid[r][c] !== selectedIdx) return; // wrong colour
    filled[r][c] = true;
    doneCells++;
    drawCell(r, c);
    updateProgress();
  }

  /** Redraw a single cell (fast path for painting). */
  function drawCell(r, c) {
    var ctx = gameCanvas.getContext("2d");
    var ci = grid[r][c];
    var x = c * CELL, y = r * CELL;
    ctx.fillStyle = palColors[ci].hex;
    ctx.fillRect(x, y, CELL, CELL);

    // Thin border
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, CELL, CELL);

    // Re-draw thick borders around this cell if needed
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1.2;
    if (c < cols - 1 && grid[r][c + 1] !== ci) {
      ctx.beginPath(); ctx.moveTo(x + CELL, y); ctx.lineTo(x + CELL, y + CELL); ctx.stroke();
    }
    if (c > 0 && grid[r][c - 1] !== ci) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + CELL); ctx.stroke();
    }
    if (r < rows - 1 && grid[r + 1][c] !== ci) {
      ctx.beginPath(); ctx.moveTo(x, y + CELL); ctx.lineTo(x + CELL, y + CELL); ctx.stroke();
    }
    if (r > 0 && grid[r - 1][c] !== ci) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); ctx.stroke();
    }
  }

  /* ================================================================
     Progress tracking
     ================================================================ */

  function updateProgress() {
    var pct = totalCells > 0 ? Math.round(doneCells / totalCells * 100) : 0;
    progressText.textContent = pct + " %";
    progressFill.style.width = pct + "%";

    if (doneCells > 0) updatePaletteChecks();
    if (doneCells === totalCells && totalCells > 0) {
      completionEl.classList.remove("hidden");
    }
  }

  function updatePaletteChecks() {
    for (var idx = 0; idx < palColors.length; idx++) {
      var total = 0, done = 0;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          if (grid[r][c] === idx) { total++; if (filled[r][c]) done++; }
        }
      }
      var el = document.getElementById("pal-check-" + idx);
      if (el) el.textContent = (done === total && total > 0) ? "✓" : "";
    }
  }

  /* ================================================================
     Zoom controls
     ================================================================ */

  zoomInBtn.addEventListener("click", function () { setZoom(zoomLevel + 0.5); });
  zoomOutBtn.addEventListener("click", function () { setZoom(zoomLevel - 0.5); });
  zoomFitBtn.addEventListener("click", function () { setZoom(1); });

  function setZoom(z) {
    zoomLevel = Math.max(0.5, Math.min(4, z));
    if (zoomLevel === 1) {
      canvasWrap.classList.remove("zoomed");
      gameCanvas.style.width = "100%";
    } else {
      canvasWrap.classList.add("zoomed");
      gameCanvas.style.width = (cols * CELL * zoomLevel) + "px";
    }
  }

  /* ================================================================
     Navigation
     ================================================================ */

  btnBack.addEventListener("click", function () { showScreen(menuScreen); });
  btnNew.addEventListener("click", function () { showScreen(menuScreen); });

  /* ================================================================
     Sample pictures
     ================================================================ */

  function buildSamples() {
    window.SAMPLES.forEach(function (s) {
      var card = document.createElement("div");
      card.className = "sample-card";

      var thumb = s.fn(130, 100);
      card.appendChild(thumb);

      var lb = document.createElement("div");
      lb.className = "label";
      lb.textContent = s.name;
      card.appendChild(lb);

      card.addEventListener("click", function () {
        loadingEl.classList.remove("hidden");
        setTimeout(function () {
          var big = s.fn(400, 400);
          var img = new Image();
          img.onload = function () {
            buildFromImage(img, parseInt(setColors.value, 10), parseInt(setGrid.value, 10));
            loadingEl.classList.add("hidden");
          };
          img.src = big.toDataURL();
        }, 60);
      });

      samplesGrid.appendChild(card);
    });
  }

  /* ================================================================
     Init
     ================================================================ */
  buildSamples();
})();
