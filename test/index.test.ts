import path from 'path';
import { bundleRequire } from '../src/index';

const FixtureDir = path.join(__dirname, './fixture');

test('main', async () => {
  const { mod, dependencies } = await bundleRequire({
    filePath: path.join(FixtureDir, 'input.ts'),
  });

  expect(mod.default.a.filename.endsWith('a.ts')).toEqual(true);
  expect(dependencies).toEqual(['test/fixture/a.ts', 'test/fixture/input.ts']);
})
