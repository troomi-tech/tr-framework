import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import peerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';
import packageJson from './package.json';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true
			}
		],
		plugins: [
			del({ targets: ['dist/*'] }),
			peerDepsExternalPlugin(),
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.json',
				exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.stories.ts', '**/*.test.ts']
			}),
			postcss({
				minimize: true,
				use: ['sass']
			}),
			terser({
				compress: {
					drop_console: true
				}
			})
		]
	},
	{
		input: 'dist/esm/types/index.d.ts',
		output: [{ file: 'dist/index.d.ts', format: 'esm' }],
		plugins: [dts()],
		external: [/\.(css|scss)$/]
	}
];
