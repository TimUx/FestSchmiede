// Temporary compatibility bridge: while the repo compiles with TypeScript 7,
// typescript-eslint still requires the TypeScript 6 API. This wrapper runs
// ESLint against a temporary symlinked node_modules tree that swaps only the
// `typescript` package to the local `typescript-6` alias. Remove it once
// upstream supports TS 7 natively and `qa:lint` can call ESLint directly again.
import { cp, mkdtemp, mkdir, readdir, rm, stat, symlink } from 'node:fs/promises';
import Module from 'node:module';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const rootNodeModules = path.join(repoRoot, 'node_modules');
const copiedEntries = new Set(['typescript-eslint', '@typescript-eslint', 'ts-api-utils']);
const { argv, execPath } = globalThis.process;
const [, , ...lintArgs] = argv;
const runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'festschmiede-eslint-'));
const runtimeNodeModules = path.join(runtimeRoot, 'node_modules');
const eslintEntry = Module.createRequire(import.meta.url).resolve('eslint');
const eslintBin = path.resolve(path.dirname(eslintEntry), '../bin/eslint.js');

await mkdir(runtimeNodeModules, { recursive: true });

for (const entry of await readdir(rootNodeModules)) {
  if (entry === '.bin' || entry === 'typescript') continue;
  const source = path.join(rootNodeModules, entry);
  const target = path.join(runtimeNodeModules, entry);
  if (copiedEntries.has(entry)) {
    await cp(source, target, { recursive: true });
  } else {
    const sourceType = (await stat(source)).isDirectory() ? 'dir' : 'file';
    await symlink(source, target, sourceType);
  }
}

await symlink(path.join(rootNodeModules, 'typescript-6'), path.join(runtimeNodeModules, 'typescript'), 'dir');

const child = spawnSync(execPath, [eslintBin, ...lintArgs], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: {
    ...globalThis.process.env,
    FESTSCHMIEDE_REPO_ROOT: repoRoot,
    FESTSCHMIEDE_ESLINT_RUNTIME_NODE_MODULES: runtimeNodeModules,
  },
});

try {
  if (child.error) {
    throw child.error;
  }
} finally {
  await rm(runtimeRoot, { recursive: true, force: true });
}

globalThis.process.exit(child.status ?? 1);
