// Temporary compatibility bridge: while the repo compiles with TypeScript 7,
// typescript-eslint and ts-api-utils still require the TypeScript 6 API.
// This hook only remaps imports originating from those package paths to the
// `typescript-6` alias and should be removed once upstream supports TS 7 natively.
import Module from 'node:module';
import path from 'node:path';

const originalLoad = Module._load;

const usesTs6Api = (filename = '') =>
  filename.includes(`${path.sep}node_modules${path.sep}typescript-eslint${path.sep}`) ||
  filename.includes(`${path.sep}node_modules${path.sep}@typescript-eslint${path.sep}`) ||
  filename.includes(`${path.sep}node_modules${path.sep}ts-api-utils${path.sep}`);

Module._load = function patchedLoad(request, parent, isMain) {
  if (usesTs6Api(parent?.filename)) {
    if (request === 'typescript') {
      return originalLoad.call(this, 'typescript-6', parent, isMain);
    }

    if (request.startsWith('typescript/')) {
      return originalLoad.call(this, request.replace(/^typescript/, 'typescript-6'), parent, isMain);
    }
  }

  return originalLoad.call(this, request, parent, isMain);
};
