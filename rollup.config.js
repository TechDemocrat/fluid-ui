import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import externals from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

import tsConfigJSON from './tsconfig.json';
import { getFiles } from './scripts/getFiles';

const plugins = [
    externals({
        deps: false,
    }),
    resolve(),
    commonjs(),
    typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        // exclude stories.tsx and test.tsx files
        exclude: [...tsConfigJSON.exclude, 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
    }),
    postcss({
        minimize: true,
        modules: true,
    }),
    terser(),
    renameNodeModules('ext'),
    visualizer({
        filename: 'bundle-analysis.html',
        open: false,
    }),
];

export default [
    {
        input: [
            'src/index.ts',
            ...getFiles('src/components', {
                extensions: ['.tsx'],
                excludeExtensions: ['.stories.tsx', 'TemplateComponent.tsx'],
                nestedLookup: 2,
            }),
            ...getFiles('src/hooks', {
                extensions: ['.tsx', '.ts'],
                excludeExtensions: ['.stories.tsx', 'TemplateComponent.tsx'],
                nestedLookup: 2,
            }),
            ...getFiles('src/utilities', {
                extensions: ['.tsx', '.ts'],
                excludeExtensions: ['.stories.tsx', 'TemplateComponent.tsx'],
                nestedLookup: 2,
            }),
        ],
        output: [
            {
                dir: 'dist',
                format: 'esm',
                preserveModules: true,
                preserveModulesRoot: 'src',
                sourcemap: true,
            },
        ],
        plugins,
        external: ['react', 'react-dom'],
    },
];
