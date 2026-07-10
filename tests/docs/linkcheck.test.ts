import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '../..');

test('docs hub exists with audience matrix', () => {
  const hub = path.join(root, 'docs/README.md');
  expect(fs.existsSync(hub)).toBe(true);
  const content = fs.readFileSync(hub, 'utf8');
  expect(content).toContain('Ehrenamt');
  expect(content).toContain('Administratoren');
  expect(content).toContain('Maintainer');
});

test('admin three-click paths are linked from docs hub', () => {
  const content = fs.readFileSync(path.join(root, 'docs/README.md'), 'utf8');
  expect(content).toContain('INSTALLATION.md');
  expect(content).toContain('erste-schritte-nach-der-installation');
  expect(content).toContain('vor-dem-sommerfest-checkliste');
});

test('linkcheck script exists', () => {
  expect(fs.existsSync(path.join(root, 'scripts/qa/linkcheck.ts'))).toBe(true);
});

test('architecture archive index exists', () => {
  expect(fs.existsSync(path.join(root, 'docs/architecture/archive/README.md'))).toBe(true);
});
