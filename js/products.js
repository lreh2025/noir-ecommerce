/* ============================================================
   products.js — Product data store
   
   Each product has:
   - id:          unique string identifier
   - name:        display name
   - category:    used for filtering (lighting|furniture|objects|textiles)
   - price:       number in USD
   - description: longer product description shown on detail page
   - symbol:      emoji/character used as visual placeholder in card
   - materials:   HTML string for the materials accordion section
   ============================================================ */

const PRODUCTS = [
  {
    id: 'arc-lamp-01',
    name: 'Arc Floor Lamp',
    category: 'lighting',
    price: 340,
    description: 'A sweeping arc in brushed steel, this lamp positions warm light precisely where you need it without intruding on the space. The weighted marble base provides stability; the woven cord runs invisibly along the stem.',
    symbol: '○',
    materials: '<p><strong>Base:</strong> Carrara marble, 8kg ballast</p><p><strong>Stem:</strong> Brushed 316 steel, 1.8m arc</p><p><strong>Shade:</strong> Spun aluminium, matte sand coating</p><p><strong>Bulb:</strong> E27 socket, 4W LED included (2700K warm white)</p>',
  },
  {
    id: 'linen-chair-01',
    name: 'Reading Chair',
    category: 'furniture',
    price: 890,
    description: 'Designed for the long sit. Wide arms that actually function as ledges for a book or glass. A seat depth that lets you tuck your feet up. Available in three linen weights; all age beautifully.',
    symbol: '◻',
    materials: '<p><strong>Frame:</strong> FSC-certified solid oak, natural oil finish</p><p><strong>Foam:</strong> High-resilience HR-35 with natural latex layer</p><p><strong>Upholstery:</strong> European linen, preshrunk, 380gsm</p><p><strong>Legs:</strong> Turned oak, 42cm height</p>',
  },
  {
    id: 'ceramic-vase-01',
    name: 'Studio Vase',
    category: 'objects',
    price: 120,
    description: 'Thrown by hand in small batches. Each piece is a slightly different expression of the same intention — that imperfect quiet that only comes from a human touch. No two are identical.',
    symbol: '◉',
    materials: '<p><strong>Material:</strong> Stoneware clay, cone 6 fired</p><p><strong>Glaze:</strong> Food-safe matte ash glaze, food-safe</p><p><strong>Dimensions:</strong> Approx. 22cm tall, 12cm diameter (varies)</p><p><strong>Care:</strong> Hand wash only. Not microwave safe.</p>',
  },
  {
    id: 'linen-throw-01',
    name: 'Linen Throw',
    category: 'textiles',
    price: 185,
    description: 'Portuguese linen woven on a century-old shuttle loom that produces a characteristic irregular texture you will not find in any factory cloth. It softens further with every wash.',
    symbol: '▭',
    materials: '<p><strong>Composition:</strong> 100% long-staple Portuguese linen</p><p><strong>Weight:</strong> 240gsm</p><p><strong>Dimensions:</strong> 140 × 200cm</p><p><strong>Care:</strong> Machine wash 40°C, tumble dry low, lightly iron damp</p>',
  },
  {
    id: 'wall-sconce-01',
    name: 'Oyster Sconce',
    category: 'lighting',
    price: 195,
    description: 'A hand-cast plaster shell that diffuses light in all directions. Mounts flush against the wall. Replaces any standard junction box and requires no special wiring.',
    symbol: '◑',
    materials: '<p><strong>Body:</strong> Hand-cast FGR plaster, sand-textured</p><p><strong>Backplate:</strong> Powder-coated steel</p><p><strong>Socket:</strong> GU10, max 50W / 10W LED</p><p><strong>Mounting:</strong> Standard 68mm back-box compatible</p>',
  },
  {
    id: 'oak-shelf-01',
    name: 'Floating Shelf',
    category: 'furniture',
    price: 145,
    description: 'Cut from solid-core oak, not veneer. The concealed bracket system creates a genuinely clean floating look — no visible fixings, no brackets, nothing to interrupt the plank.',
    symbol: '▬',
    materials: '<p><strong>Shelf:</strong> Solid European oak, 35mm thick, natural oil finish</p><p><strong>Bracket:</strong> Laser-cut 4mm steel, galvanised</p><p><strong>Fixings:</strong> Included for masonry and timber-frame walls</p><p><strong>Load:</strong> 30kg per bracket; supplied with 2 brackets</p>',
  },
  {
    id: 'marble-tray-01',
    name: 'Marble Catch Tray',
    category: 'objects',
    price: 80,
    description: 'The object that quietly organises everything else. Keys, coins, a watch. Cut from a single piece of Nero Marquina marble with bevelled edges that catch the light.',
    symbol: '▪',
    materials: '<p><strong>Material:</strong> Nero Marquina black marble</p><p><strong>Dimensions:</strong> 20 × 13 × 2cm</p><p><strong>Base:</strong> Felt-lined to protect surfaces</p><p><strong>Finish:</strong> Honed, unsealed. Will develop a patina.</p>',
  },
  {
    id: 'wool-cushion-01',
    name: 'Boucle Cushion',
    category: 'textiles',
    price: 95,
    description: 'Boucle in a natural undyed fleece. The looped texture creates a surface that reads differently in every light condition. Hidden zip, feather-down inner.',
    symbol: '◈',
    materials: '<p><strong>Cover:</strong> 70% wool, 30% cotton boucle</p><p><strong>Inner:</strong> 90% feather, 10% down</p><p><strong>Dimensions:</strong> 50 × 50cm</p><p><strong>Care:</strong> Dry clean cover. Spot clean inner.</p>',
  },
  {
    id: 'task-lamp-01',
    name: 'Task Lamp',
    category: 'lighting',
    price: 220,
    description: 'Four pivot points. Counterbalanced spring arm. The kind of precise articulation that lets you position light to the centimetre, then forget it is there.',
    symbol: '△',
    materials: '<p><strong>Arms:</strong> Extruded aluminium, anodised</p><p><strong>Springs:</strong> Stainless tension springs</p><p><strong>Base:</strong> Cast iron, powder-coated graphite</p><p><strong>Bulb:</strong> G9 socket, 4W LED included</p>',
  },
  {
    id: 'side-table-01',
    name: 'Tripod Side Table',
    category: 'furniture',
    price: 310,
    description: 'Three legs, no apron. The geometry is both why it works and what makes it beautiful. The glass top elevates everything placed on it. Assembles in under two minutes.',
    symbol: '△',
    materials: '<p><strong>Legs:</strong> Solid black walnut, tapered</p><p><strong>Top:</strong> Toughened glass, 10mm, edge-polished</p><p><strong>Fixings:</strong> Threaded brass inserts, tool-free assembly</p><p><strong>Dimensions:</strong> 55cm tall, 45cm diameter</p>',
  },
  {
    id: 'candle-01',
    name: 'Soy Column Candle',
    category: 'objects',
    price: 55,
    description: 'A pillar of natural soy wax with a single cotton wick. No vessel, no container — just pure form. Burns clean, drips minimally, smells of nothing except warm air.',
    symbol: '▲',
    materials: '<p><strong>Wax:</strong> 100% natural soy, cosmetic grade</p><p><strong>Wick:</strong> Unbleached cotton, pre-tabbed</p><p><strong>Burn time:</strong> Approx. 40 hours</p><p><strong>Dimensions:</strong> 7cm diameter × 18cm tall</p>',
  },
  {
    id: 'merino-blanket-01',
    name: 'Merino Blanket',
    category: 'textiles',
    price: 265,
    description: 'Extra-fine 18.5-micron Merino from New Zealand, woven into a herringbone weave that adds visual interest without sacrificing the softness. Heavy enough to feel substantial, light enough to wear.',
    symbol: '▩',
    materials: '<p><strong>Composition:</strong> 100% New Zealand Merino, 18.5 micron</p><p><strong>Weave:</strong> 2/2 herringbone</p><p><strong>Weight:</strong> 450gsm</p><p><strong>Dimensions:</strong> 150 × 220cm</p><p><strong>Care:</strong> Hand wash cold or delicate cycle, lay flat to dry</p>',
  },
];
