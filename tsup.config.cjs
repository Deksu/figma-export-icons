/** @type {import('tsup').Options} */
module.exports = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'], // 👈 exclude peer deps
};