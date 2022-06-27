import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import packageJSON from './package.json';
import tsConfigJSON from './tsconfig.json';

const rollupOptions = [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJSON.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJSON.module,
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            postcss({
                minimize: true,
                modules: true,
            }),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                // exclude stories.tsx and test.tsx files
                exclude: [...tsConfigJSON.exclude, 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
            }),
            terser(),
        ],
        external: ['react', 'react-dom'],
    },
    {
        input: 'dist/esm/types/index.d.ts',
        output: [
            {
                file: 'dist/index.d.ts',
                format: 'esm',
            },
        ],
        external: [/\.scss$/], // ignore .scss file
        plugins: [dts()],
    },
];

export default rollupOptions;
