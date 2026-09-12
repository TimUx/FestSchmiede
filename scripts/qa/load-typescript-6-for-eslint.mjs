// Temporary compatibility bridge: while the repo compiles with TypeScript 7,
// typescript-eslint and ts-api-utils still require the TypeScript 6 API.
// This file is a dedicated ESLint wrapper, so it can patch both ESM resolution
// and CommonJS require() only for the lint process. Remove it once upstream
// supports TS 7 natively and `qa:lint` can call ESLint directly again.
import Module, { registerHooks } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const targetSegments = [
  `${path.sep}node_modules${path.sep}typescript-eslint${path.sep}`,
  `${path.sep}node_modules${path.sep}@typescript-eslint${path.sep}`,
  `${path.sep}node_modules${path.sep}ts-api-utils${path.sep}`,
];

const usesTs6Api = (parentURL = '') => {
  const filename = parentURL.startsWith('file:') ? fileURLToPath(parentURL) : parentURL;
  return targetSegments.some((segment) => filename.includes(segment));
};

const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (usesTs6Api(parent?.filename ?? '')) {
    if (request === 'typescript') {
      return originalLoad.call(this, 'typescript-6', parent, isMain);
    }

    if (request.startsWith('typescript/')) {
      return originalLoad.call(this, request.replace(/^typescript/, 'typescript-6'), parent, isMain);
    }
  }

  return originalLoad.call(this, request, parent, isMain);
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (usesTs6Api(context.parentURL)) {
      if (specifier === 'typescript') {
        return nextResolve('typescript-6', context);
      }

      if (specifier.startsWith('typescript/')) {
        return nextResolve(specifier.replace(/^typescript/, 'typescript-6'), context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const eslintEntry = Module.createRequire(import.meta.url).resolve('eslint');
const eslintBin = path.resolve(path.dirname(eslintEntry), '../bin/eslint.js');
const { argv, execPath } = globalThis.process;
globalThis.process.argv = [execPath, eslintBin, ...argv.slice(2)];
await import(pathToFileURL(eslintBin).href);
