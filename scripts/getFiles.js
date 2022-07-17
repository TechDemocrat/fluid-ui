const fs = require('fs');

/**
 *
 * @param {string} entry
 * @param {{extensions?: string[], excludeExtensions?: string[], nestedLookup?: number, replaceExtensions: {[string]: string} }} [options]
 * @returns {string[]}
 */
export const getFiles = (entry, options) => {
    const { extensions = [], excludeExtensions = [], replaceExtensions = {} } = options;
    const shouldReplaceExtension = Object.keys(replaceExtensions).length > 0;
    let { nestedLookup } = options;
    let fileNames = [];
    let dirs = [];
    try {
        dirs = fs.readdirSync(entry);
    } catch (error) {
        console.error(error);
        return [];
    }
    nestedLookup--;
    dirs.forEach((dir) => {
        const path = `${entry}/${dir}`;

        if (fs.lstatSync(path).isDirectory()) {
            if (nestedLookup > 0) {
                fileNames = [
                    ...fileNames,
                    ...getFiles(path, {
                        ...options,
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
            let reqPath = path;
            if (shouldReplaceExtension) {
                Object.keys(replaceExtensions).forEach((ext) => {
                    reqPath = reqPath.replace(ext, replaceExtensions[ext]);
                });
            }
            fileNames.push(reqPath);
        }
    });

    return fileNames;
};
