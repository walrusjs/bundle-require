import path from 'path';
import fs from 'fs';
import { JS_EXT_RE } from '../config';

import type { Plugin, Loader } from 'esbuild';

function inferLoader(ext: string): Loader {
  if (ext === '.mjs' || ext === '.cjs') return 'js'
  return ext.slice(1) as Loader
}

export const replaceDirnamePlugin = (): Plugin => {
  return {
    name: 'bundle-require:replace-path',
    setup(ctx) {
      ctx.onLoad({ filter: JS_EXT_RE }, async (args) => {
        const contents = await fs.promises.readFile(args.path, 'utf-8')
        return {
          contents: contents
            .replace(/\b__filename\b/g, JSON.stringify(args.path))
            .replace(/\b__dirname\b/g, JSON.stringify(path.dirname(args.path)))
            .replace(
              /\bimport\.meta\.url\b/g,
              JSON.stringify(`file://${args.path}`),
            ),
          loader: inferLoader(path.extname(args.path)),
        }
      })
    },
  }
}