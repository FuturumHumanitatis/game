/* Color-by-numbers game logic */

(function () {
  "use strict";

  // --- DOM references ---
  var menuScreen = document.getElementById("menu-screen");
  var gameScreen = document.getElementById("game-screen");
  var pictureGrid = document.getElementById("picture-grid");
  var gameCanvas = document.getElementById("game-canvas");
  var palette = document.getElementById("palette");
  var progressText = document.getElementById("progress-text");
  var progressFill = document.getElementById("progress-fill");
  var completionMessage = document.getElementById("completion-message");
  var btnBack = document.getElementById("btn-back");
  var btnNext = document.getElementById("btn-next");

  // --- State ---
  var currentPictureIndex = -1;
  var selectedColor = null; // the number currently selected in the palette
  var filledRegions = {};   // regionId → true when correctly filled

  // ============================================================
  //  Menu screen – build picture cards
  // ============================================================

  function buildMenu() {
    pictureGrid.innerHTML = "";
    PICTURES.forEach(function (pic, index) {
      var card = document.createElement("div");
      card.className = "picture-card";
      card.setAttribute("data-index", index);

      // Thumbnail SVG (show outlined shapes with numbers)
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 500 500");
      pic.regions.forEach(function (r) {
        var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", r.path);
        p.setAttribute("fill", "#fff");
        p.setAttribute("stroke", "#aaa");
        p.setAttribute("stroke-width", "1.5");
        svg.appendChild(p);
      });
      card.appendChild(svg);

      var title = document.createElement("div");
      title.className = "card-title";
      title.textContent = pic.name;
      card.appendChild(title);

      var diff = document.createElement("div");
      diff.className = "card-difficulty";
      diff.textContent = pic.difficulty;
      card.appendChild(diff);

      card.addEventListener("click", function () {
        startGame(index);
      });

      pictureGrid.appendChild(card);
    });
  }

  // ============================================================
  //  Show / hide screens
  // ============================================================

  function showScreen(screen) {
    menuScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    screen.classList.add("active");
  }

  // ============================================================
  //  Start game for a specific picture
  // ============================================================

  function startGame(index) {
    currentPictureIndex = index;
    selectedColor = null;
    filledRegions = {};
    completionMessage.classList.add("hidden");
    renderPicture(PICTURES[index]);
    renderPalette(PICTURES[index]);
    updateProgress(PICTURES[index]);
    showScreen(gameScreen);
  }

  // ============================================================
  //  Render the SVG picture on the game canvas
  // ============================================================

  function renderPicture(pic) {
    gameCanvas.innerHTML = "";

    pic.regions.forEach(function (region) {
      // Path
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", region.path);
      path.setAttribute("class", "region");
      path.setAttribute("data-id", region.id);
      path.setAttribute("data-number", region.number);

      path.addEventListener("click", function () {
        onRegionClick(region, path, pic);
      });

      gameCanvas.appendChild(path);

      // Label (number)
      var label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", region.labelX);
      label.setAttribute("y", region.labelY);
      label.setAttribute("class", "region-label");
      label.setAttribute("data-for", region.id);
      label.textContent = region.number;
      gameCanvas.appendChild(label);
    });
  }

  // ============================================================
  //  Render colour palette
  // ============================================================

  function renderPalette(pic) {
    palette.innerHTML = "";
    var numbers = Object.keys(pic.colors).sort(function (a, b) { return a - b; });

    numbers.forEach(function (num) {
      var item = document.createElement("div");
      item.className = "palette-item";
      item.setAttribute("data-number", num);

      var swatch = document.createElement("div");
      swatch.className = "palette-swatch";
      swatch.style.backgroundColor = pic.colors[num];

      var numberEl = document.createElement("span");
      numberEl.className = "palette-number";
      numberEl.textContent = num;

      item.appendChild(swatch);
      item.appendChild(numberEl);

      item.addEventListener("click", function () {
        selectColor(Number(num));
      });

      palette.appendChild(item);
    });
  }

  // ============================================================
  //  Select a colour from the palette
  // ============================================================

  function selectColor(num) {
    selectedColor = num;
    var items = palette.querySelectorAll(".palette-item");
    items.forEach(function (el) {
      el.classList.toggle("selected", Number(el.getAttribute("data-number")) === num);
    });
  }

  // ============================================================
  //  Handle click on a region
  // ============================================================

  function onRegionClick(region, pathEl, pic) {
    if (selectedColor === null) return;
    if (filledRegions[region.id]) return; // already correctly filled

    if (selectedColor === region.number) {
      // Correct!
      pathEl.style.fill = pic.colors[region.number];
      pathEl.classList.add("filled");
      filledRegions[region.id] = true;

      // Hide the number label
      var label = gameCanvas.querySelector('[data-for="' + region.id + '"]');
      if (label) label.classList.add("hidden");

      updateProgress(pic);
    } else {
      // Wrong – flash the region
      pathEl.style.fill = "#fecaca";
      setTimeout(function () {
        if (!filledRegions[region.id]) {
          pathEl.style.fill = "#fff";
        }
      }, 400);
    }
  }

  // ============================================================
  //  Update progress bar
  // ============================================================

  function updateProgress(pic) {
    var total = pic.regions.length;
    var done = Object.keys(filledRegions).length;
    var pct = Math.round((done / total) * 100);
    progressText.textContent = pct + "%";
    progressFill.style.width = pct + "%";

    if (done === total) {
      completionMessage.classList.remove("hidden");
    }
  }

  // ============================================================
  //  Navigation
  // ============================================================

  btnBack.addEventListener("click", function () {
    showScreen(menuScreen);
  });

  btnNext.addEventListener("click", function () {
    var next = (currentPictureIndex + 1) % PICTURES.length;
    startGame(next);
  });

  // ============================================================
  //  Initialise
  // ============================================================

  buildMenu();
})();
