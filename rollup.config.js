import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
// import { terser } from 'rollup-plugin-terser'; // enable on production
import externals from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';
import renameNodeModules from 'rollup-plugin-rename-node-modules';
import cleaner from 'rollup-plugin-cleaner';

import tsConfigJSON from './tsconfig.json';
import { getFiles } from './scripts/getFiles';

const plugins = [
    cleaner({ targets: ['dist'] }),
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
    // terser(),
    renameNodeModules('ext'),
    visualizer({
        filename: 'bundle-analysis.html',
        open: false,
    }),
];

const inputFiles = ['src/components', 'src/hooks', 'src/utilities'].reduce((result, current) => {
    result.push(
        ...getFiles(current, {
            extensions: ['.tsx', '.ts'],
            excludeExtensions: ['.stories.tsx', 'TemplateComponent.tsx', '.d.ts'],
            nestedLookup: 2,
        }),
    );
    return result;
}, []);

export default [
    {
        input: inputFiles,
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
