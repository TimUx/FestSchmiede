import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const backendDist = path.join(repoRoot, 'backend/dist');
const backendEntry = path.join(backendDist, 'src/index.js');
const declarationOutputs = [];

function collectDeclarationOutputs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectDeclarationOutputs(entryPath);
      continue;
    }
    if (entryPath.endsWith('.d.ts') || entryPath.endsWith('.d.ts.map')) {
      declarationOutputs.push(path.relative(repoRoot, entryPath));
    }
  }
}

if (!existsSync(backendEntry)) {
  throw new Error(`Backend build output fehlt: ${path.relative(repoRoot, backendEntry)}`);
}

collectDeclarationOutputs(backendDist);

if (declarationOutputs.length > 0) {
  throw new Error(
    `Backend Build hat unerwartete Declaration-Dateien erzeugt:\n${declarationOutputs.join('\n')}`
  );
}
