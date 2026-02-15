/**
 * Picture definitions for the color-by-numbers game.
 *
 * Each picture has:
 *   name     – display name
 *   colors   – map of number → hex color
 *   regions  – array of { id, number, path, labelX, labelY }
 *              id      – unique region id
 *              number  – which color number this region uses
 *              path    – SVG path data (d attribute)
 *              labelX, labelY – centre of the label
 */

/* exported PICTURES */
var PICTURES = [
  /* ---- 1. House ---- */
  {
    name: "Домик",
    difficulty: "Легко",
    colors: {
      1: "#e53e3e", // red   – roof
      2: "#ecc94b", // yellow – walls
      3: "#4299e1", // blue  – door
      4: "#48bb78", // green – grass
      5: "#805ad5", // purple – window
      6: "#ed8936"  // orange – chimney
    },
    regions: [
      // Walls
      { id: "h-wall", number: 2, path: "M100,250 L400,250 L400,430 L100,430 Z", labelX: 250, labelY: 340 },
      // Roof
      { id: "h-roof", number: 1, path: "M70,250 L250,100 L430,250 Z", labelX: 250, labelY: 210 },
      // Door
      { id: "h-door", number: 3, path: "M210,310 L290,310 L290,430 L210,430 Z", labelX: 250, labelY: 380 },
      // Window left
      { id: "h-win-l", number: 5, path: "M130,280 L185,280 L185,340 L130,340 Z", labelX: 157, labelY: 310 },
      // Window right
      { id: "h-win-r", number: 5, path: "M315,280 L370,280 L370,340 L315,340 Z", labelX: 342, labelY: 310 },
      // Chimney
      { id: "h-chimney", number: 6, path: "M340,110 L380,110 L380,185 L340,185 Z", labelX: 360, labelY: 148 },
      // Grass
      { id: "h-grass", number: 4, path: "M0,430 L500,430 L500,500 L0,500 Z", labelX: 250, labelY: 465 }
    ]
  },

  /* ---- 2. Flower ---- */
  {
    name: "Цветок",
    difficulty: "Легко",
    colors: {
      1: "#e53e3e", // red petals
      2: "#ecc94b", // yellow center
      3: "#48bb78", // green stem
      4: "#9f7aea", // violet petals
      5: "#38a169"  // dark green leaf
    },
    regions: [
      // Petals (top, right, bottom, left, top-right, bottom-right, bottom-left, top-left)
      { id: "f-pt",  number: 1, path: "M250,140 C270,100 290,80 250,40 C210,80 230,100 250,140 Z", labelX: 250, labelY: 90 },
      { id: "f-pr",  number: 4, path: "M310,200 C350,180 380,170 400,210 C370,230 340,220 310,200 Z", labelX: 355, labelY: 198 },
      { id: "f-pb",  number: 1, path: "M250,260 C270,300 290,330 250,360 C210,330 230,300 250,260 Z", labelX: 250, labelY: 310 },
      { id: "f-pl",  number: 4, path: "M190,200 C150,180 120,170 100,210 C130,230 160,220 190,200 Z", labelX: 145, labelY: 198 },
      { id: "f-ptr", number: 1, path: "M290,155 C320,130 350,120 370,150 C345,175 315,170 290,155 Z", labelX: 330, labelY: 148 },
      { id: "f-pbr", number: 4, path: "M290,245 C320,270 350,285 370,255 C345,230 315,235 290,245 Z", labelX: 330, labelY: 258 },
      { id: "f-pbl", number: 1, path: "M210,245 C180,270 150,285 130,255 C155,230 185,235 210,245 Z", labelX: 170, labelY: 258 },
      { id: "f-ptl", number: 4, path: "M210,155 C180,130 150,120 130,150 C155,175 185,170 210,155 Z", labelX: 170, labelY: 148 },
      // Centre
      { id: "f-center", number: 2, path: "M250,170 C280,170 310,185 310,200 C310,230 280,245 250,245 C220,245 190,230 190,200 C190,185 220,170 250,170 Z", labelX: 250, labelY: 207 },
      // Stem
      { id: "f-stem", number: 3, path: "M243,260 L257,260 L257,460 L243,460 Z", labelX: 250, labelY: 380 },
      // Leaf left
      { id: "f-leaf-l", number: 5, path: "M243,360 C200,340 160,350 150,380 C170,380 210,370 243,380 Z", labelX: 195, labelY: 365 },
      // Leaf right
      { id: "f-leaf-r", number: 5, path: "M257,320 C300,300 340,310 350,340 C330,340 290,330 257,340 Z", labelX: 305, labelY: 325 }
    ]
  },

  /* ---- 3. Fish ---- */
  {
    name: "Рыбка",
    difficulty: "Средне",
    colors: {
      1: "#ed8936", // orange body
      2: "#4299e1", // blue stripe
      3: "#ecc94b", // yellow tail
      4: "#2d3748", // dark eye
      5: "#e53e3e", // red fin
      6: "#48bb78"  // green water
    },
    regions: [
      // Body top
      { id: "fi-body-t", number: 1, path: "M120,220 C160,140 280,120 370,180 L370,230 C300,200 200,190 120,220 Z", labelX: 240, labelY: 185 },
      // Body stripe
      { id: "fi-stripe", number: 2, path: "M120,220 C200,190 300,200 370,230 L370,280 C300,260 200,250 110,280 Z", labelX: 240, labelY: 245 },
      // Body bottom
      { id: "fi-body-b", number: 1, path: "M110,280 C200,250 300,260 370,280 C320,350 200,370 110,320 Z", labelX: 240, labelY: 310 },
      // Tail
      { id: "fi-tail", number: 3, path: "M370,180 L450,120 L450,380 L370,280 Z", labelX: 415, labelY: 240 },
      // Eye
      { id: "fi-eye", number: 4, path: "M165,200 A20,20 0 1,1 165,199.99 Z", labelX: 165, labelY: 200 },
      // Top fin
      { id: "fi-fin-t", number: 5, path: "M200,160 L260,80 L300,160 Z", labelX: 253, labelY: 135 },
      // Bottom fin
      { id: "fi-fin-b", number: 5, path: "M200,340 L240,410 L280,340 Z", labelX: 240, labelY: 370 },
      // Water top
      { id: "fi-water-t", number: 6, path: "M0,0 L500,0 L500,120 C400,80 300,100 250,80 C200,60 100,100 0,80 Z", labelX: 250, labelY: 45 },
      // Water bottom
      { id: "fi-water-b", number: 6, path: "M0,420 C100,400 200,440 250,420 C300,400 400,420 500,400 L500,500 L0,500 Z", labelX: 250, labelY: 465 }
    ]
  },

  /* ---- 4. Butterfly ---- */
  {
    name: "Бабочка",
    difficulty: "Средне",
    colors: {
      1: "#9f7aea", // purple wing
      2: "#ed8936", // orange wing spot
      3: "#4299e1", // blue wing spot
      4: "#2d3748", // dark body
      5: "#e53e3e", // red lower wing
      6: "#ecc94b"  // yellow antenna
    },
    regions: [
      // Left upper wing
      { id: "b-lu", number: 1, path: "M245,170 C200,100 100,60 60,130 C40,180 90,230 245,220 Z", labelX: 150, labelY: 160 },
      // Right upper wing
      { id: "b-ru", number: 1, path: "M255,170 C300,100 400,60 440,130 C460,180 410,230 255,220 Z", labelX: 350, labelY: 160 },
      // Left lower wing
      { id: "b-ll", number: 5, path: "M245,230 C150,240 70,290 80,360 C90,400 160,400 245,310 Z", labelX: 155, labelY: 310 },
      // Right lower wing
      { id: "b-rl", number: 5, path: "M255,230 C350,240 430,290 420,360 C410,400 340,400 255,310 Z", labelX: 345, labelY: 310 },
      // Left upper spot
      { id: "b-ls", number: 2, path: "M170,140 A30,25 0 1,1 170,139.99 Z", labelX: 170, labelY: 140 },
      // Right upper spot
      { id: "b-rs", number: 3, path: "M330,140 A30,25 0 1,1 330,139.99 Z", labelX: 330, labelY: 140 },
      // Left lower spot
      { id: "b-lls", number: 3, path: "M165,310 A22,22 0 1,1 165,309.99 Z", labelX: 165, labelY: 310 },
      // Right lower spot
      { id: "b-rls", number: 2, path: "M335,310 A22,22 0 1,1 335,309.99 Z", labelX: 335, labelY: 310 },
      // Body
      { id: "b-body", number: 4, path: "M245,160 L255,160 L258,400 L242,400 Z", labelX: 250, labelY: 280 },
      // Left antenna
      { id: "b-la", number: 6, path: "M248,165 C230,120 190,80 180,60 C176,52 184,48 190,55 C210,75 240,115 252,165 Z", labelX: 210, labelY: 100 },
      // Right antenna
      { id: "b-ra", number: 6, path: "M252,165 C270,120 310,80 320,60 C324,52 316,48 310,55 C290,75 260,115 248,165 Z", labelX: 290, labelY: 100 }
    ]
  },

  /* ---- 5. Car ---- */
  {
    name: "Машина",
    difficulty: "Средне",
    colors: {
      1: "#e53e3e", // red body
      2: "#4299e1", // blue windows
      3: "#2d3748", // dark wheels
      4: "#a0aec0", // grey bumper
      5: "#ecc94b", // yellow headlights
      6: "#718096"  // road
    },
    regions: [
      // Body
      { id: "c-body", number: 1, path: "M60,270 L440,270 L440,350 L60,350 Z", labelX: 250, labelY: 310 },
      // Roof
      { id: "c-roof", number: 1, path: "M130,270 L180,180 L350,180 L400,270 Z", labelX: 265, labelY: 235 },
      // Windshield
      { id: "c-wind", number: 2, path: "M185,190 L210,270 L290,270 L290,190 Z", labelX: 245, labelY: 240 },
      // Rear window
      { id: "c-rear", number: 2, path: "M300,190 L300,270 L385,270 L360,190 Z", labelX: 340, labelY: 240 },
      // Front wheel
      { id: "c-fw", number: 3, path: "M145,350 A40,40 0 1,1 145,349.99 Z", labelX: 145, labelY: 350 },
      // Rear wheel
      { id: "c-rw", number: 3, path: "M355,350 A40,40 0 1,1 355,349.99 Z", labelX: 355, labelY: 350 },
      // Front bumper
      { id: "c-fb", number: 4, path: "M60,270 L60,350 L90,370 L90,270 Z", labelX: 75, labelY: 320 },
      // Rear bumper
      { id: "c-rb", number: 4, path: "M410,270 L440,270 L440,350 L410,370 Z", labelX: 425, labelY: 320 },
      // Headlight
      { id: "c-hl", number: 5, path: "M60,280 L80,280 L80,310 L60,310 Z", labelX: 70, labelY: 295 },
      // Taillight
      { id: "c-tl", number: 5, path: "M420,280 L440,280 L440,310 L420,310 Z", labelX: 430, labelY: 295 },
      // Road
      { id: "c-road", number: 6, path: "M0,390 L500,390 L500,500 L0,500 Z", labelX: 250, labelY: 445 }
    ]
  },

  /* ---- 6. Star ---- */
  {
    name: "Звезда",
    difficulty: "Легко",
    colors: {
      1: "#ecc94b", // yellow star
      2: "#4299e1", // blue background
      3: "#ed8936", // orange inner
      4: "#e53e3e"  // red center
    },
    regions: [
      // Star outer
      {
        id: "s-outer", number: 1,
        path: "M250,50 L290,180 L430,180 L315,260 L355,390 L250,310 L145,390 L185,260 L70,180 L210,180 Z",
        labelX: 250, labelY: 150
      },
      // Star inner pentagon
      {
        id: "s-inner", number: 3,
        path: "M250,160 L280,220 L330,235 L295,270 L305,325 L250,295 L195,325 L205,270 L170,235 L220,220 Z",
        labelX: 250, labelY: 250
      },
      // Star center circle
      {
        id: "s-center", number: 4,
        path: "M250,220 A30,30 0 1,1 250,219.99 Z",
        labelX: 250, labelY: 220
      },
      // Background top-left
      { id: "s-bg1", number: 2, path: "M0,0 L250,0 L210,180 L70,180 L0,180 Z", labelX: 80, labelY: 80 },
      // Background top-right
      { id: "s-bg2", number: 2, path: "M250,0 L500,0 L500,180 L430,180 L290,180 Z", labelX: 420, labelY: 80 },
      // Background bottom-left
      { id: "s-bg3", number: 2, path: "M0,180 L70,180 L185,260 L145,390 L0,500 Z", labelX: 60, labelY: 370 },
      // Background bottom-right
      { id: "s-bg4", number: 2, path: "M500,180 L430,180 L315,260 L355,390 L500,500 Z", labelX: 440, labelY: 370 },
      // Background bottom-center
      { id: "s-bg5", number: 2, path: "M145,390 L250,310 L355,390 L500,500 L0,500 Z", labelX: 250, labelY: 440 }
    ]
  }
];
