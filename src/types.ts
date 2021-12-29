import type { BuildOptions } from 'esbuild';

export type RequireFunction = (
  outfile: string,
  ctx: { format: 'cjs' | 'esm' },
) => any;

export type GetOutputFile = (filepath: string, format: 'esm' | 'cjs') => string;

export interface Options {
  cwd?: string;
  filePath: string;
  require?: RequireFunction;
  /** 配置tsconfig.json路径 */
  tsconfig?: string;
  /** esbuild 配置 */
  esbuildOptions?: BuildOptions;
  /** 是否保留临时文件 */
  preserveTemporaryFile?: boolean;
  /** External packages */
  external?: (string | RegExp)[];
  getOutputFile?: GetOutputFile
}