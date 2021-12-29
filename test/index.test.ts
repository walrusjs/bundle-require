import path from 'path';
import { bundleRequire } from '../src/index';

const FixtureDir = path.join(__dirname, './fixture');

test('javascript', async () => {
  const { mod, dependencies } = await bundleRequire({
    filePath: path.join(FixtureDir, 'javascript/walrus.config.js'),
  });

  expect(mod.default).toEqual({
    name: 'walrus'
  });

  expect(dependencies).toEqual([
    'test/fixture/javascript/config.js',
    'test/fixture/javascript/walrus.config.js',
  ]);
});

test('javascript-mjs', async () => {
  const { mod, dependencies } = await bundleRequire({
    filePath: path.join(FixtureDir, 'javascript-mjs/walrus.config.js'),
  });

  expect(mod).toEqual({
    name: 'walrus'
  });

  expect(dependencies).toEqual([
    'test/fixture/javascript-mjs/config.js',
    'test/fixture/javascript-mjs/walrus.config.js',
  ]);
});

test('typescript', async () => {
  const { mod, dependencies } = await bundleRequire({
    filePath: path.join(FixtureDir, 'typescript/walrus.config.ts'),
  });

  expect(mod.default).toEqual({
    name: 'walrus'
  });

  expect(dependencies).toEqual([
    'test/fixture/typescript/config.ts',
    'test/fixture/typescript/walrus.config.ts',
  ]);
});

test('typescript-paths', async () => {
  const { mod, dependencies } = await bundleRequire({
    cwd: path.join(FixtureDir, 'typescript-paths'),
    filePath: path.join(FixtureDir, 'typescript-paths/walrus.config.ts'),
  });

  expect(mod.config).toEqual({
    name: 'foo'
  });

  expect(dependencies).toEqual([
    'src/foo.ts',
    'walrus.config.ts',
  ]);
});
