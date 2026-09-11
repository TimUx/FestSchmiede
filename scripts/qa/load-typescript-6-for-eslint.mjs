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
