const fs = require('fs');

/**
 *
 * @param {string} entry
 * @param {{extensions?: string[], excludeExtensions?: string[], nestedLookup?: number }} [options]
 * @returns {string[]}
 */
export const getFiles = (entry, options) => {
    const { extensions = [], excludeExtensions = [] } = options;
    let { nestedLookup } = options;
    let fileNames = [];
    const dirs = fs.readdirSync(entry);
    nestedLookup--;
    dirs.forEach((dir) => {
        const path = `${entry}/${dir}`;

        if (fs.lstatSync(path).isDirectory()) {
            if (nestedLookup > 0) {
                fileNames = [
                    ...fileNames,
                    ...getFiles(path, {
                        extensions,
                        excludeExtensions,
                        nestedLookup,
                    }),
                ];
            }
            return;
        }

        if (
            !excludeExtensions.some((exclude) => dir.endsWith(exclude)) &&
            extensions.some((ext) => dir.endsWith(ext))
        ) {
            fileNames.push(path);
        }
    });

    return fileNames;
};
