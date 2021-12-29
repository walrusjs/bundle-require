import fs from 'fs';
import { pathToFileURL } from 'url';
import { build } from 'esbuild';
import { loadTsConfig } from './utils/tsconfig';
import { JS_EXT_RE } from './config';
import { 
  guessFormat, 
  dynamicImport,
  tsconfigPathsToRegExp,
  defaultGetOutputFile,
} from './utils';
import { externalPlugin, replaceDirnamePlugin, } from './plugins';

import type { Options, RequireFunction, } from './types';
import type { BuildResult } from 'esbuild';

export async function bundleRequire(options: Options) {
  if (!JS_EXT_RE.test(options.filePath)) {
    throw new Error(`${options.filePath} is not a valid JS file`)
  }

  const preserveTemporaryFile = options.preserveTemporaryFile ?? !!process.env.BUNDLE_REQUIRE_PRESERVE
  const cwd = options.cwd || process.cwd();
  const format = guessFormat(options.filePath);
  const tsconfig = loadTsConfig(options.cwd, options.tsconfig);
  const resolvePaths = tsconfigPathsToRegExp(
    tsconfig.data?.compilerOptions?.paths || {},
  );

  const extractResult = async (result: BuildResult) => {
    if (!result.outputFiles) {
      throw new Error(`[bundle-require] no output files`)
    }

    const { text } = result.outputFiles[0];

    const getOutputFile = options.getOutputFile || defaultGetOutputFile
    const outfile = getOutputFile(options.filePath, format)

    await fs.promises.writeFile(outfile, text, 'utf8')

    let mod: any
    const req: RequireFunction = options.require || dynamicImport;

    try {
      mod = await req(
        format === 'esm' ? pathToFileURL(outfile).href : outfile,
        { format },
      )
    } finally {
      if (!preserveTemporaryFile) {
        await fs.promises.unlink(outfile)
      }
    }

    return {
      mod,
      dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
    }
  }

  const result = await build({
    ...options.esbuildOptions,
    absWorkingDir: cwd,
    entryPoints: [
      options.filePath
    ],
    outfile: 'out.js',
    format,
    platform: 'node',
    sourcemap: 'inline',
    bundle: true,
    metafile: true,
    write: false,
    plugins: [
      ...(options.esbuildOptions?.plugins || []),
      externalPlugin({
        external: options.external,
        notExternal: resolvePaths,
      }),
      replaceDirnamePlugin(),
    ],
  });

  return extractResult(result);
}