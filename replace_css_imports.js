// Replace inline CSS template literals with style imports
const fs = require("fs");

function replaceCssWithImport(filePath, cssVarName, importLine, newVarRef) {
  const src = fs.readFileSync(filePath, "utf8");
  const c = src.replace(/\r\n/g, "\n");
  
  const startMarker = `const ${cssVarName} = \``;
  const startIdx = c.indexOf(startMarker);
  if (startIdx === -1) { console.log(`SKIP: no ${cssVarName} in ${filePath}`); return; }
  
  let closeIdx = startIdx + startMarker.length;
  while (closeIdx < c.length && c[closeIdx] !== '`') closeIdx++;
  closeIdx++; // include the closing backtick
  // Skip `;` if present
  if (c[closeIdx] === ';') closeIdx++;
  
  const before = c.substring(0, startIdx);
  const after = c.substring(closeIdx);
  
  // Add import before the first existing import or at the top
  // Find "use client" or first import line
  let insertPos = 0;
  const useClientIdx = c.indexOf('"use client"');
  if (useClientIdx !== -1) {
    insertPos = c.indexOf('\n', useClientIdx) + 1;
  }
  
  // Build new const ref line if different from original
  const constLine = newVarRef ? `const ${cssVarName} = ${newVarRef};` : "";
  
  // Reconstruct: put import after "use client", then the rest without the template literal
  const beforeUseClient = c.substring(0, insertPos);
  const afterUseClient = c.substring(insertPos, startIdx);
  const newContent = beforeUseClient + importLine + "\n" + afterUseClient + (constLine ? constLine + "\n" : "") + after;
  
  fs.writeFileSync(filePath, newContent);
  const lines = newContent.split("\n").length;
  console.log(`✓ ${filePath}: ${lines} lines`);
}

// faith/page.tsx - css was split into faithStyles1 + faithStyles2
replaceCssWithImport(
  "app/faith/page.tsx",
  "css",
  `import { faithStyles1 } from "./faithStyles1";\nimport { faithStyles2 } from "./faithStyles2";`,
  "faithStyles1 + faithStyles2"
);

// credo/page.tsx
replaceCssWithImport(
  "app/credo/page.tsx",
  "css",
  `import { credoStyles } from "./credoStyles";`,
  "credoStyles"
);

// testimonials/page.tsx
replaceCssWithImport(
  "app/testimonials/page.tsx",
  "css",
  `import { testimonialsStyles } from "./testimonialsStyles";`,
  "testimonialsStyles"
);

// resources/visual/page.tsx
replaceCssWithImport(
  "app/resources/visual/page.tsx",
  "css",
  `import { visualStyles } from "./visualStyles";`,
  "visualStyles"
);

// my-story/page.tsx - split into myStoryStyles1 + myStoryStyles2
replaceCssWithImport(
  "app/my-story/page.tsx",
  "css",
  `import { myStoryStyles1 } from "./myStoryStyles1";\nimport { myStoryStyles2 } from "./myStoryStyles2";`,
  "myStoryStyles1 + myStoryStyles2"
);

// blog/page.tsx
replaceCssWithImport(
  "app/blog/page.tsx",
  "blogCss",
  `import { blogStyles } from "./blogStyles";`,
  "blogStyles"
);

console.log("\n✓ All CSS replacements done");
