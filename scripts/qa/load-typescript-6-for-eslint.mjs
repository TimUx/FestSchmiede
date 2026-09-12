// Temporary compatibility bridge: while the repo compiles with TypeScript 7,
// typescript-eslint and ts-api-utils still require the TypeScript 6 API.
// This hook only remaps imports originating from those package paths to the
// `typescript-6` alias and should be removed once upstream supports TS 7 natively.
import { registerHooks } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const targetSegments = [
  `${path.sep}node_modules${path.sep}typescript-eslint${path.sep}`,
  `${path.sep}node_modules${path.sep}@typescript-eslint${path.sep}`,
  `${path.sep}node_modules${path.sep}ts-api-utils${path.sep}`,
];

const usesTs6Api = (parentURL = '') => {
  const filename = parentURL.startsWith('file:') ? fileURLToPath(parentURL) : parentURL;
  return targetSegments.some((segment) => filename.includes(segment));
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
