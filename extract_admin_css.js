// Extract adminThemeCss from admin/page.tsx
const fs = require("fs");

const src = fs.readFileSync("app/admin/page.tsx", "utf8");
const c = src.replace(/\r\n/g, "\n");

// Extract adminThemeCss
const cssStartMarker = "const adminThemeCss = `";
const cssStart = c.indexOf(cssStartMarker) + cssStartMarker.length;
let cssEnd = cssStart;
while (cssEnd < c.length && c[cssEnd] !== '`') cssEnd++;
const cssContent = c.substring(cssStart, cssEnd);
const cssLines = cssContent.split("\n").length;
console.log("adminThemeCss lines:", cssLines);

fs.writeFileSync("app/admin/components/adminThemeCss.ts", 
  `export const adminThemeCss = \`\n${cssContent}\n\`;\n`);
console.log("✓ adminThemeCss.ts written");

// Replace in page.tsx
const beforeCss = c.substring(0, c.indexOf("const adminThemeCss = `"));
const afterCss = c.substring(cssEnd + 1); // skip closing backtick

// Check if there's a semicolon after the backtick
const cleanAfter = afterCss.startsWith(";") ? afterCss.substring(1) : afterCss;

// Add import after the other imports block
const importInsert = `import { adminThemeCss } from "./components/adminThemeCss";\n`;

// Find last import line
let lastImportEnd = 0;
let pos = 0;
while (true) {
  const importIdx = c.indexOf("\nimport ", pos);
  if (importIdx === -1) break;
  // Find end of this import line  
  const endOfLine = c.indexOf("\n", importIdx + 1);
  lastImportEnd = endOfLine + 1;
  pos = importIdx + 1;
}
console.log("Last import ends at:", lastImportEnd);
console.log("Context around last import:", JSON.stringify(c.substring(lastImportEnd-50, lastImportEnd+50)));

// Remove the adminThemeCss declaration, add import at top
const newContent = c.substring(0, lastImportEnd) + importInsert + c.substring(lastImportEnd, c.indexOf("const adminThemeCss = `")) + cleanAfter;

fs.writeFileSync("app/admin/page.tsx", newContent);
const newLines = newContent.split("\n").length;
console.log("admin/page.tsx now:", newLines, "lines");
