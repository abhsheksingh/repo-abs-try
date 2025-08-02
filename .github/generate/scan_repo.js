// .github/generate/scan_repo.js

import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd(); // Root of the repo
const ignoreDirs = new Set(['.git', 'node_modules', '.github/generate/workflow-graph-app/build']);

/** Recursively scan directory and collect file paths */
function scanDir(dir, parent = null, nodes = [], edges = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(repoRoot, fullPath);

    if (ignoreDirs.has(item.name)) continue;

    const id = relPath.replace(/\\/g, '/'); // For Windows compatibility
    nodes.push({ id });

    if (parent) {
      edges.push({ source: parent, target: id });
    }

    if (item.isDirectory()) {
      scanDir(fullPath, id, nodes, edges);
    }
  }

  return { nodes, edges };
}

const { nodes, edges } = scanDir(repoRoot);
const graph = { nodes, edges };

// Output file
const outputPath = path.join(repoRoot, '.github/generate/workflow_graph.json');
fs.writeFileSync(outputPath, JSON.stringify(graph, null, 2));

console.log(`✅ Repo graph written to ${outputPath}`);
