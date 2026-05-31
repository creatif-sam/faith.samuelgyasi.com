// Batch extract CSS from large page files
const fs = require("fs");
const path = require("path");

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function extractCss(filePath, cssVarName, stylesFilePath, exportName) {
  const src = fs.readFileSync(filePath, "utf8");
  const c = src.replace(/\r\n/g, "\n");
  
  const startMarker = `const ${cssVarName} = \``;
  const startIdx = c.indexOf(startMarker);
  if (startIdx === -1) { console.log(`SKIP ${filePath}: no ${cssVarName}`); return; }
  
  const cssContentStart = startIdx + startMarker.length;
  // Find closing backtick
  let closeIdx = cssContentStart;
  while (closeIdx < c.length && c[closeIdx] !== '`') closeIdx++;
  const cssContent = c.substring(cssContentStart, closeIdx);
  const cssLines = cssContent.split("\n").length;
  
  // Check if it's > 400 lines and needs further splitting
  console.log(`${path.basename(filePath)}: ${cssVarName} has ${cssLines} lines`);
  
  ensureDir(path.dirname(stylesFilePath));
  
  if (cssLines > 400) {
    // Need to split
    const lines = cssContent.split("\n");
    // Find split point around line 370
    let splitAt = 370;
    for (let i = 360; i < Math.min(420, lines.length); i++) {
      const l = lines[i].trim();
      if (l === "" || l.startsWith("/*")) { splitAt = i; break; }
    }
    const css1 = lines.slice(0, splitAt).join("\n");
    const css2 = lines.slice(splitAt).join("\n");
    const base = stylesFilePath.replace(/\.ts$/, "");
    fs.writeFileSync(base + "1.ts", `export const ${exportName}1 = \`\n${css1}\n\`;\n`);
    fs.writeFileSync(base + "2.ts", `export const ${exportName}2 = \`\n${css2}\n\`;\n`);
    console.log(`  → split: part1=${css1.split("\n").length} part2=${css2.split("\n").length}`);
    return { split: true, export1: exportName + "1", export2: exportName + "2", 
             import1: base.split("/").pop() + "1", import2: base.split("/").pop() + "2" };
  } else {
    fs.writeFileSync(stylesFilePath, `export const ${exportName} = \`\n${cssContent}\n\`;\n`);
    console.log(`  → extracted to ${path.basename(stylesFilePath)} (${cssLines} lines)`);
    return { split: false };
  }
}

// --- faith/page.tsx ---
extractCss("app/faith/page.tsx", "css", "app/faith/faithStyles.ts", "faithStyles");

// --- credo/page.tsx ---
extractCss("app/credo/page.tsx", "css", "app/credo/credoStyles.ts", "credoStyles");

// --- testimonials/page.tsx ---
extractCss("app/testimonials/page.tsx", "css", "app/testimonials/testimonialsStyles.ts", "testimonialsStyles");

// --- resources/visual/page.tsx ---
extractCss("app/resources/visual/page.tsx", "css", "app/resources/visual/visualStyles.ts", "visualStyles");

// --- my-story/page.tsx ---
extractCss("app/my-story/page.tsx", "css", "app/my-story/myStoryStyles.ts", "myStoryStyles");

// --- blog/page.tsx ---
extractCss("app/blog/page.tsx", "blogCss", "app/blog/blogStyles.ts", "blogStyles");

console.log("\n✓ CSS extraction done");
