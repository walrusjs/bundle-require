import path from 'path';
import fs from 'fs';
import { jsonParse } from './index';

/**
 * 获取 tsconfig.json 配置
 * @param dir
 * @param filename
 * @returns
 */
export function loadTsConfig(
  dir = process.cwd(),
  filename = 'tsconfig.json',
): any {
  const { root } = path.parse(dir);

  while (dir !== root) {
    const filePath = path.join(dir, filename);

    if (fs.existsSync(filePath)) {
      const contents = fs.readFileSync(filePath, 'utf8');

      return {
        data: jsonParse(contents),
        path: filePath
      }
    }
    dir = path.dirname(dir);
  }

  return {};
}
