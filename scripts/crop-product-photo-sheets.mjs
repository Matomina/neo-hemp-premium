/* global console, process */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { PNG } from "pngjs";

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "src/data/products.ts");
const sheetsDir = path.join(projectRoot, "public/generated-sheets");
const outputRoot = path.join(projectRoot, "public/products");

const sheetLayouts = {
  fleurs: { file: "fleurs-sheet.png", columns: 4, rows: 4 },
  resines: { file: "resines-sheet.png", columns: 5, rows: 2 },
  concentres: { file: "concentres-sheet.png", columns: 5, rows: 2 },
  huiles: { file: "huiles-sheet.png", columns: 5, rows: 2 },
  cosmetiques: { file: "cosmetiques-sheet.png", columns: 5, rows: 2 },
  eliquides: { file: "eliquides-sheet.png", columns: 5, rows: 2 },
  accessoires: { file: "accessoires-sheet.png", columns: 5, rows: 2 },
  packs: { file: "packs-sheet.png", columns: 5, rows: 2 },
  animaux: { file: "animaux-sheet.png", columns: 5, rows: 2 },
};

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

const cropPng = (image, x, y, width, height) => {
  const out = new PNG({ width, height });

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const srcIdx = ((image.width * (y + row)) + (x + col)) << 2;
      const dstIdx = ((width * row) + col) << 2;
      out.data[dstIdx] = image.data[srcIdx];
      out.data[dstIdx + 1] = image.data[srcIdx + 1];
      out.data[dstIdx + 2] = image.data[srcIdx + 2];
      out.data[dstIdx + 3] = image.data[srcIdx + 3];
    }
  }

  return out;
};

const ensureCategoryCrops = (category, items) => {
  const layout = sheetLayouts[category];

  if (!layout) {
    return;
  }

  const sheetPath = path.join(sheetsDir, layout.file);
  const image = PNG.sync.read(fs.readFileSync(sheetPath));

  items.forEach((product, index) => {
    const column = index % layout.columns;
    const row = Math.floor(index / layout.columns);
    const x0 = Math.round((column * image.width) / layout.columns);
    const x1 = Math.round(((column + 1) * image.width) / layout.columns);
    const y0 = Math.round((row * image.height) / layout.rows);
    const y1 = Math.round(((row + 1) * image.height) / layout.rows);
    const crop = cropPng(image, x0, y0, x1 - x0, y1 - y0);
    const outDir = path.join(outputRoot, category);
    const outPath = path.join(outDir, `${slugify(product.name)}.png`);

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, PNG.sync.write(crop));
  });
};

const main = () => {
  const seeds = readSeeds();
  const byCategory = new Map();

  for (const seed of seeds) {
    if (!byCategory.has(seed.category)) {
      byCategory.set(seed.category, []);
    }

    byCategory.get(seed.category).push(seed);
  }

  for (const [category, items] of byCategory.entries()) {
    ensureCategoryCrops(category, items);
  }

  console.log(`Cropped realistic product photos for ${seeds.length} products.`);
};

main();
