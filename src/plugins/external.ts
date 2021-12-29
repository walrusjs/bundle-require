import path from 'path'

import type { Plugin } from 'esbuild';

export const externalPlugin = ({
  external,
  notExternal,
}: {
  external?: (string | RegExp)[]
  notExternal?: (string | RegExp)[]
} = {}): Plugin => {
  return {
    name: 'bundle-require:external',
    setup(ctx) {
      ctx.onResolve({ filter: /.*/ }, async (args) => {
        if (args.path[0] === '.' || path.isAbsolute(args.path)) {
          // Fallback to default
          return
        }

        if (match(args.path, external)) {
          return {
            external: true,
          }
        }

        if (match(args.path, notExternal)) {
          // Should be resolved by esbuild
          return
        }

        // Most like importing from node_modules, mark external
        return {
          external: true,
        }
      })
    },
  }
}

export const match = (id: string, patterns?: (string | RegExp)[]) => {
  if (!patterns) return false
  return patterns.some((p) => {
    if (p instanceof RegExp) {
      return p.test(id)
    }
    return id === p || id.startsWith(p + '/')
  })
}