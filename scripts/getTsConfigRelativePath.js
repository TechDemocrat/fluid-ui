/***   ./config/utils/Files.js   ***/
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

/*
 * Fix paths to use the path of the current process' directory if it's within a symlinked path.
 * Otherwise, IDEs may have trouble with automatic resolutions for ESLint, file paths, etc.
 *
 * Short summary:
 * - process.cwd() == `npm prefix` - Doesn't preserve symlinks
 * - process.env.PWD == `pwd` - Preserves symlinks
 * - fs.realpathSync(process.env.PWD) == `realpath $(pwd)` - Doesn't preserve symlinks
 */

// Root directory of repository - absolute path without preserving symlinks
// You could use your own logic here, this was my choice so the root dir was always the same regardless
// of where a script/process was run
const realPath = path.resolve(childProcess.execSync('npm prefix').toString().replace(/\n/g, ''));
// Root dir preserving symlinks + current process' path (e.g. if in a nested directory from the root)
const currentProcessPath = process.env.PWD;
// Only the nested directory, used for diffing any (non-)symlink-preserving path (nested or not) with
// the repo root in order to convert PWD to the root dir
const currentProcessNestedPath = fs.realpathSync(currentProcessPath).replace(realPath, '');
// Root dir preserving symlinks without the nested directory
const rootDirMaintainingSymlinks = currentProcessPath.replace(currentProcessNestedPath, '');

// Final constant for use in other files
const rootDir = rootDirMaintainingSymlinks;

// Now to resolve the tsconfig.json
const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');

module.exports = {
    rootDir,
    tsconfigPath,
};
