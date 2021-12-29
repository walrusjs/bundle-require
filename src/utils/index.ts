import path from 'path';
import fs from 'fs';
import strip from 'strip-json-comments';
import { JS_EXT_RE } from '../config';

import type { GetOutputFile, RequireFunction } from '../types';

export const usingDynamicImport = typeof jest === 'undefined';

/**
 * Json解析
 * @param data
 */
export function jsonParse(data: string) {
  try {
    return new Function(`return ${strip(data).trim()}`)();
  } catch (e) {
    return {}
  }
}

export function guessFormat(inputFile: string): 'esm' | 'cjs' {
  if (!usingDynamicImport) return 'cjs';

  const ext = path.extname(inputFile)
  const type = getPkgType();

  if (ext === '.js') {
    return type === 'module' ? 'esm' : 'cjs'
  } else if (ext === '.ts') {
    return 'esm'
  } else if (ext === '.mjs') {
    return 'esm'
  }
  return 'cjs'
}

/**
 * 获取包类型
 * @returns
 */
export const getPkgType = (): string | undefined => {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve('package.json'), 'utf-8'),
    )
    return pkg.type
  } catch (error) {}
}

export const tsconfigPathsToRegExp = (paths: Record<string, any>) => {
  return Object.keys(paths || {}).map((key) => {
    return new RegExp(`^${key.replace(/\*/, '.*')}$`)
  })
}

export const defaultGetOutputFile: GetOutputFile = (filepath, format) =>
  filepath.replace(
    JS_EXT_RE,
    `.bundled_${Date.now()}.${format === 'esm' ? 'mjs' : 'js'}`,
  );

export const dynamicImport: RequireFunction = (id: string, { format }) => {
  const fn = format === 'esm'
    ? new Function('file', 'return import(file)')
    : require;

  return fn(id)
}
