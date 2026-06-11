/* global console, process */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "src/data/products.ts");
const outputRoot = path.join(projectRoot, "public/products");

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const readSeeds = () => {
  const sourceText = fs.readFileSync(sourcePath, "utf8");
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const getValue = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      return node.text;
    }

    if (ts.isNumericLiteral(node)) {
      return Number(node.text);
    }

    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return true;
    }

    if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return false;
    }

    if (ts.isArrayLiteralExpression(node)) {
      return node.elements.map(getValue);
    }

    return undefined;
  };

  let seedsNode;

  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;

    for (const declaration of node.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "seeds" &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        seedsNode = declaration.initializer;
      }
    }
  });

  if (!seedsNode) {
    throw new Error("Impossible de trouver le tableau seeds dans src/data/products.ts");
  }

  return seedsNode.elements
    .filter(ts.isObjectLiteralExpression)
    .map((element) => {
      const product = {};

      for (const property of element.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        if (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name)) continue;
        product[property.name.text] = getValue(property.initializer);
      }

      return product;
    });
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const pickPalette = (product) => {
  const tokens = [
    product.name,
    product.subcategory,
    ...(product.flavors ?? []),
    ...(product.highlights ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const byCategory = {
    fleurs: { base: "#193226", accent: "#63d18b", accentSoft: "#acd86f", glow: "#7cf4bd" },
    resines: { base: "#2f2018", accent: "#cc8e45", accentSoft: "#f3c36e", glow: "#ffca78" },
    concentres: { base: "#20191f", accent: "#f6bf4e", accentSoft: "#eae6ff", glow: "#9de8ff" },
    huiles: { base: "#1f2222", accent: "#e1b255", accentSoft: "#fff0ae", glow: "#f7d27f" },
    cosmetiques: { base: "#211d24", accent: "#d98ae9", accentSoft: "#ffd7fa", glow: "#ffb8ed" },
    eliquides: { base: "#1c2025", accent: "#8ec5ff", accentSoft: "#e7f1ff", glow: "#93fff1" },
    accessoires: { base: "#1c2321", accent: "#7ee4b5", accentSoft: "#defcee", glow: "#68d8ff" },
    packs: { base: "#231d1d", accent: "#e0b769", accentSoft: "#ffe8b8", glow: "#df9fff" },
    animaux: { base: "#1c2229", accent: "#77d3d0", accentSoft: "#d9f6f3", glow: "#9fe7ff" },
  }[product.category];

  if (/citron|lemon|zeste|agrum|orange/.test(tokens)) {
    return { ...byCategory, accent: "#f2d34f", accentSoft: "#fff2ab", glow: "#ffd66e" };
  }
  if (/mangue|mango|banana|tropic|ananas/.test(tokens)) {
    return { ...byCategory, accent: "#ffb34d", accentSoft: "#ffe08c", glow: "#ffcf72" };
  }
  if (/myrtille|blue|purple|violet|fruits noirs/.test(tokens)) {
    return { ...byCategory, accent: "#8d7dff", accentSoft: "#d4cfff", glow: "#b693ff" };
  }
  if (/fraise|framboise|rouges|berry/.test(tokens)) {
    return { ...byCategory, accent: "#ff6b8d", accentSoft: "#ffd0dc", glow: "#ff99b6" };
  }
  if (/menthe|ice|glac|frais/.test(tokens)) {
    return { ...byCategory, accent: "#71d8ff", accentSoft: "#d8fbff", glow: "#84fff0" };
  }
  if (/vanille|noisette|cookie|gelato|creme|cremeux|gourmand/.test(tokens)) {
    return { ...byCategory, accent: "#d4b37b", accentSoft: "#fff0cf", glow: "#ffe3a8" };
  }
  if (/lavande|nuit|serum|diamant/.test(tokens)) {
    return { ...byCategory, accent: "#9c84ff", accentSoft: "#e5deff", glow: "#bfa4ff" };
  }

  return byCategory;
};

const renderBackdrop = (palette) => `
  <rect width="800" height="800" fill="#090b10" />
  <rect width="800" height="800" fill="url(#bg)" />
  <ellipse cx="400" cy="180" rx="280" ry="100" fill="${palette.glow}" opacity="0.16" filter="url(#blur-xl)" />
  <ellipse cx="400" cy="690" rx="290" ry="70" fill="#000000" opacity="0.68" filter="url(#blur-md)" />
  <rect x="44" y="44" width="712" height="712" rx="44" fill="none" stroke="rgba(255,255,255,0.08)" />
`;

const bud = (x, y, r, fill, fill2, rotate) => `
  <g transform="translate(${x} ${y}) rotate(${rotate})">
    <ellipse cx="0" cy="0" rx="${r * 0.76}" ry="${r}" fill="${fill}" />
    <ellipse cx="-8" cy="-6" rx="${r * 0.38}" ry="${r * 0.54}" fill="${fill2}" opacity="0.82" />
    <ellipse cx="10" cy="6" rx="${r * 0.3}" ry="${r * 0.46}" fill="#f9d77a" opacity="0.22" />
    <circle cx="-18" cy="-6" r="${Math.max(3, r * 0.09)}" fill="#d46d38" opacity="0.72" />
    <circle cx="9" cy="14" r="${Math.max(2.5, r * 0.08)}" fill="#d46d38" opacity="0.64" />
  </g>
`;

const renderFlower = (palette) => `
  <g filter="url(#shadow)">
    ${bud(400, 424, 150, palette.accent, palette.base, -8)}
    ${bud(308, 500, 112, palette.base, palette.accentSoft, -38)}
    ${bud(494, 504, 108, palette.base, palette.accentSoft, 34)}
    ${bud(390, 580, 88, palette.accent, palette.base, 0)}
    <g opacity="0.9">
      <circle cx="410" cy="360" r="6" fill="#ffffff" opacity="0.8" />
      <circle cx="446" cy="412" r="5" fill="#ffffff" opacity="0.7" />
      <circle cx="332" cy="472" r="4" fill="#ffffff" opacity="0.65" />
      <circle cx="486" cy="506" r="4" fill="#ffffff" opacity="0.72" />
      <circle cx="370" cy="566" r="5" fill="#ffffff" opacity="0.72" />
    </g>
  </g>
`;

const renderResin = (palette, product) => {
  const rounded = /temple|charas/.test((product.name ?? "").toLowerCase());
  const powder = /pollen|ice-o-lator|bubble/.test((product.name ?? "").toLowerCase());

  if (powder) {
    return `
      <g filter="url(#shadow)">
        <path d="M245 560 C300 500 500 500 555 560 C495 610 305 618 245 560Z" fill="${palette.accent}" />
        <path d="M290 540 C346 498 458 496 508 540 C454 572 344 578 290 540Z" fill="${palette.accentSoft}" opacity="0.78" />
        ${Array.from({ length: 18 }, (_, i) => {
          const x = 265 + (i % 6) * 48;
          const y = 520 + Math.floor(i / 6) * 20;
          return `<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="#fff5d4" opacity="0.55" />`;
        }).join("")}
      </g>
    `;
  }

  if (rounded) {
    return `
      <g filter="url(#shadow)">
        <circle cx="400" cy="486" r="144" fill="${palette.base}" />
        <path d="M302 434 C324 376 468 374 500 438 C472 420 444 414 404 414 C360 414 330 422 302 434Z" fill="${palette.accent}" opacity="0.26" />
        <path d="M288 528 C334 572 468 580 524 530 C492 604 326 612 288 528Z" fill="${palette.accentSoft}" opacity="0.18" />
      </g>
    `;
  }

  return `
    <g filter="url(#shadow)">
      <path d="M248 522 L302 360 L542 384 L508 560 L292 596 Z" fill="${palette.base}" />
      <path d="M302 360 L360 326 L570 352 L542 384 Z" fill="${palette.accent}" opacity="0.92" />
      <path d="M542 384 L570 352 L538 532 L508 560 Z" fill="${palette.accentSoft}" opacity="0.5" />
      <path d="M286 538 C360 516 444 516 520 534" stroke="#ffffff" stroke-opacity="0.14" stroke-width="6" stroke-linecap="round" />
    </g>
  `;
};

const renderConcentrate = (palette, product) => {
  const crystal = /isolat|cristaux|shatter/.test((product.name ?? "").toLowerCase());

  if (crystal) {
    return `
      <g filter="url(#shadow)">
        <path d="M312 566 L270 470 L334 350 L418 384 L446 512 L384 606 Z" fill="${palette.accentSoft}" />
        <path d="M448 548 L420 424 L504 344 L570 440 L534 582 Z" fill="${palette.accent}" />
        <path d="M336 352 L414 388 L504 344 L430 320 Z" fill="#ffffff" opacity="0.32" />
        <path d="M308 564 L382 606 L450 548 L420 510 Z" fill="${palette.glow}" opacity="0.28" />
      </g>
    `;
  }

  return `
    <g filter="url(#shadow)">
      <path d="M250 548 C270 420 372 344 474 358 C556 370 596 468 540 556 C482 640 324 628 250 548Z" fill="${palette.base}" />
      <path d="M298 500 C318 434 386 384 452 396 C496 404 528 444 530 486 C486 470 442 462 396 466 C360 468 330 478 298 500Z" fill="${palette.accent}" opacity="0.42" />
      <ellipse cx="426" cy="448" rx="92" ry="38" fill="#ffffff" opacity="0.1" />
    </g>
  `;
};

const renderBottle = (palette, product) => {
  const pump = /corps|serum|massage|spray|pelage/.test(`${product.name} ${product.subcategory}`.toLowerCase());
  const dropper = /visage|chanvre|huile|cbg|5%|10%|20%|30%/.test(`${product.name} ${product.subcategory}`.toLowerCase());
  const bodyColor = /nuit|lavande|diamant/.test(product.name.toLowerCase())
    ? "#334070"
    : /chanvre/.test(product.name.toLowerCase())
      ? "#214337"
      : palette.base;

  return `
    <g filter="url(#shadow)">
      <rect x="300" y="250" width="200" height="344" rx="42" fill="${bodyColor}" />
      <rect x="320" y="280" width="160" height="264" rx="28" fill="url(#liquid)" opacity="0.9" />
      ${
        pump
          ? `<rect x="356" y="188" width="88" height="74" rx="16" fill="#b49355" />
             <rect x="420" y="176" width="84" height="18" rx="9" fill="#dcb975" />
             <rect x="410" y="194" width="18" height="42" rx="9" fill="#dcb975" />`
          : dropper
            ? `<rect x="350" y="188" width="100" height="70" rx="18" fill="#b49355" />
               <rect x="386" y="146" width="28" height="60" rx="14" fill="#dcb975" />
               <ellipse cx="400" cy="142" rx="28" ry="18" fill="#dcb975" />`
            : `<rect x="340" y="194" width="120" height="58" rx="18" fill="#b49355" />`
      }
      <rect x="334" y="392" width="132" height="86" rx="20" fill="#ffffff" opacity="0.08" />
      <ellipse cx="386" cy="330" rx="90" ry="40" fill="#ffffff" opacity="0.08" />
    </g>
  `;
};

const renderCosmetic = (palette, product) => {
  const tube = /gel|roll-on/.test(`${product.name} ${product.subcategory}`.toLowerCase());
  const jar = /baume|masque|creme|crème/.test(`${product.name} ${product.subcategory}`.toLowerCase());

  if (tube) {
    return `
      <g filter="url(#shadow)">
        <path d="M328 264 L472 264 L516 590 L284 590 Z" fill="${palette.base}" />
        <path d="M350 296 L450 296 L476 548 L324 548 Z" fill="url(#liquid)" opacity="0.9" />
        <rect x="322" y="590" width="156" height="44" rx="14" fill="#d8c4ec" />
      </g>
    `;
  }

  if (jar) {
    return `
      <g filter="url(#shadow)">
        <rect x="272" y="392" width="256" height="170" rx="42" fill="${palette.base}" />
        <rect x="292" y="414" width="216" height="118" rx="30" fill="url(#liquid)" opacity="0.88" />
        <rect x="294" y="342" width="212" height="58" rx="24" fill="#d1b0eb" />
      </g>
    `;
  }

  return renderBottle(palette, product);
};

const fruitProp = (palette, tokens) => {
  if (/pomme/.test(tokens)) {
    return `<circle cx="560" cy="560" r="32" fill="#9ddd50" /><path d="M560 520 C570 506 584 498 598 502" stroke="#557c2c" stroke-width="5" stroke-linecap="round" /><ellipse cx="588" cy="510" rx="14" ry="8" fill="#79b84a" transform="rotate(-24 588 510)" />`;
  }
  if (/vanille|noisette/.test(tokens)) {
    return `<ellipse cx="552" cy="566" rx="36" ry="24" fill="#b27e48" transform="rotate(-12 552 566)" /><ellipse cx="604" cy="554" rx="18" ry="14" fill="#825734" /><path d="M520 520 C548 494 578 486 620 492" stroke="#ead8a1" stroke-width="7" stroke-linecap="round" />`;
  }
  if (/framboise|rouges/.test(tokens)) {
    return `<circle cx="552" cy="564" r="26" fill="#ff6d8a" /><circle cx="582" cy="542" r="20" fill="#f94f76" /><circle cx="606" cy="570" r="18" fill="#ff89a2" />`;
  }
  if (/myrtille|blue/.test(tokens)) {
    return `<circle cx="554" cy="564" r="24" fill="#6375ff" /><circle cx="586" cy="544" r="18" fill="#5062d7" /><circle cx="608" cy="572" r="16" fill="#8390ff" />`;
  }
  if (/citron|gingembre|orange/.test(tokens)) {
    return `<circle cx="566" cy="562" r="30" fill="#f6d654" /><path d="M610 544 C620 530 632 524 646 524" stroke="#f2c77a" stroke-width="8" stroke-linecap="round" /><path d="M626 512 L652 502 L644 530" fill="#d8a46c" />`;
  }
  if (/menthe/.test(tokens)) {
    return `<ellipse cx="570" cy="554" rx="20" ry="38" fill="#7ce4bf" transform="rotate(-24 570 554)" /><ellipse cx="604" cy="560" rx="18" ry="34" fill="#57d3aa" transform="rotate(18 604 560)" />`;
  }
  return `<circle cx="582" cy="558" r="28" fill="${palette.accent}" opacity="0.8" />`;
};

const renderELiquid = (palette, product) => {
  const tokens = [product.name, ...(product.flavors ?? [])].join(" ").toLowerCase();

  return `
    <g filter="url(#shadow)">
      <rect x="310" y="258" width="180" height="326" rx="34" fill="#f8fbff" opacity="0.12" />
      <rect x="338" y="300" width="124" height="236" rx="18" fill="url(#liquid)" opacity="0.95" />
      <rect x="352" y="214" width="96" height="92" rx="18" fill="#dfe9f5" />
      <rect x="374" y="188" width="52" height="42" rx="10" fill="#b7c0cd" />
      ${fruitProp(palette, tokens)}
      <path d="M208 266 C228 250 244 248 268 258" stroke="${palette.glow}" stroke-width="12" stroke-linecap="round" opacity="0.3" />
      <path d="M530 238 C560 206 598 202 630 224" stroke="${palette.glow}" stroke-width="12" stroke-linecap="round" opacity="0.3" />
    </g>
  `;
};

const renderAccessory = (palette, product) => {
  const tokens = `${product.name} ${product.subcategory}`.toLowerCase();

  if (/grinder/.test(tokens)) {
    return `
      <g filter="url(#shadow)">
        <circle cx="400" cy="440" r="146" fill="${palette.base}" />
        <circle cx="400" cy="440" r="112" fill="${palette.accent}" opacity="0.22" />
        ${Array.from({ length: 14 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 14;
          const x = 400 + Math.cos(angle) * 86;
          const y = 440 + Math.sin(angle) * 86;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${palette.accentSoft}" />`;
        }).join("")}
      </g>
    `;
  }

  if (/vaporisateur/.test(tokens)) {
    return `
      <g filter="url(#shadow)">
        <rect x="344" y="196" width="112" height="408" rx="48" fill="${palette.base}" />
        <rect x="364" y="234" width="72" height="200" rx="18" fill="${palette.accent}" opacity="0.28" />
        <rect x="368" y="470" width="64" height="84" rx="18" fill="${palette.accentSoft}" opacity="0.3" />
      </g>
    `;
  }

  if (/balance/.test(tokens)) {
    return `
      <g filter="url(#shadow)">
        <rect x="248" y="352" width="304" height="214" rx="26" fill="${palette.base}" />
        <rect x="294" y="392" width="212" height="78" rx="18" fill="${palette.accent}" opacity="0.16" />
        <circle cx="338" cy="518" r="22" fill="${palette.accentSoft}" />
        <circle cx="402" cy="518" r="22" fill="${palette.accentSoft}" />
        <circle cx="466" cy="518" r="22" fill="${palette.accentSoft}" />
      </g>
    `;
  }

  if (/feuilles/.test(tokens)) {
    return `
      <g filter="url(#shadow)">
        <rect x="262" y="318" width="276" height="208" rx="22" fill="${palette.base}" transform="rotate(-8 400 422)" />
        <rect x="288" y="344" width="224" height="156" rx="18" fill="${palette.accent}" opacity="0.18" transform="rotate(-8 400 422)" />
      </g>
    `;
  }

  if (/plateau/.test(tokens)) {
    return `
      <g filter="url(#shadow)">
        <rect x="220" y="382" width="360" height="186" rx="34" fill="${palette.base}" />
        <rect x="244" y="406" width="312" height="138" rx="24" fill="${palette.accent}" opacity="0.14" />
      </g>
    `;
  }

  if (/pochette/.test(tokens)) {
    return `
      <g filter="url(#shadow)">
        <rect x="258" y="316" width="284" height="250" rx="32" fill="${palette.base}" />
        <path d="M258 380 C320 340 480 340 542 380" stroke="${palette.accentSoft}" stroke-width="10" opacity="0.5" />
      </g>
    `;
  }

  if (/nettoyage|entretien/.test(tokens)) {
    return `
      <g filter="url(#shadow)">
        <rect x="296" y="254" width="88" height="318" rx="30" fill="${palette.base}" />
        <rect x="422" y="280" width="82" height="292" rx="24" fill="${palette.base}" />
        <path d="M334 224 L346 176 L358 224" stroke="${palette.accentSoft}" stroke-width="14" stroke-linecap="round" />
        <circle cx="463" cy="252" r="26" fill="${palette.accent}" opacity="0.45" />
      </g>
    `;
  }

  return `
    <g filter="url(#shadow)">
      <rect x="272" y="338" width="256" height="244" rx="38" fill="${palette.base}" />
      <rect x="304" y="370" width="192" height="180" rx="26" fill="${palette.accent}" opacity="0.16" />
    </g>
  `;
};

const renderPack = (palette) => `
  <g filter="url(#shadow)">
    <path d="M262 354 L400 288 L540 354 L400 420 Z" fill="${palette.accent}" opacity="0.84" />
    <path d="M262 354 L262 544 L400 620 L400 420 Z" fill="${palette.base}" />
    <path d="M540 354 L540 544 L400 620 L400 420 Z" fill="${palette.accentSoft}" opacity="0.42" />
    <rect x="326" y="464" width="46" height="72" rx="12" fill="#f6d674" opacity="0.7" />
    <rect x="380" y="448" width="40" height="88" rx="12" fill="#8bc9ff" opacity="0.72" />
    <rect x="428" y="476" width="42" height="60" rx="12" fill="#df9eff" opacity="0.7" />
  </g>
`;

const renderAnimal = (palette, product) => `
  <g filter="url(#shadow)">
    ${/spray|shampoing|mousse/.test(product.name.toLowerCase()) ? renderBottle(palette, product) : renderCosmetic(palette, product)}
    <g transform="translate(548 560)">
      <circle cx="0" cy="0" r="22" fill="${palette.accentSoft}" />
      <circle cx="-28" cy="-24" r="12" fill="${palette.accentSoft}" />
      <circle cx="-6" cy="-38" r="12" fill="${palette.accentSoft}" />
      <circle cx="18" cy="-34" r="12" fill="${palette.accentSoft}" />
      <circle cx="38" cy="-18" r="12" fill="${palette.accentSoft}" />
    </g>
  </g>
`;

const renderProductVisual = (product, palette) => {
  switch (product.category) {
    case "fleurs":
      return renderFlower(palette);
    case "resines":
      return renderResin(palette, product);
    case "concentres":
      return renderConcentrate(palette, product);
    case "huiles":
      return renderBottle(palette, product);
    case "cosmetiques":
      return renderCosmetic(palette, product);
    case "eliquides":
      return renderELiquid(palette, product);
    case "accessoires":
      return renderAccessory(palette, product);
    case "packs":
      return renderPack(palette);
    case "animaux":
      return renderAnimal(palette, product);
    default:
      return renderCosmetic(palette, product);
  }
};

const renderSvg = (product) => {
  const palette = pickPalette(product);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${esc(product.name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.base}" />
      <stop offset="58%" stop-color="#0d1016" />
      <stop offset="100%" stop-color="#050608" />
    </linearGradient>
    <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${palette.accentSoft}" />
      <stop offset="100%" stop-color="${palette.accent}" />
    </linearGradient>
    <filter id="blur-xl" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="70" />
    </filter>
    <filter id="blur-md" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="24" />
    </filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="28" stdDeviation="36" flood-color="#000000" flood-opacity="0.42" />
    </filter>
  </defs>
  ${renderBackdrop(palette)}
  ${renderProductVisual(product, palette)}
</svg>
`;
};

const main = () => {
  const seeds = readSeeds();

  for (const product of seeds) {
    const category = product.category;
    const slug = slugify(product.name);
    const outDir = path.join(outputRoot, category);
    const outFile = path.join(outDir, `${slug}.svg`);

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, renderSvg(product), "utf8");
  }

  console.log(`Generated ${seeds.length} product visuals.`);
};

main();
