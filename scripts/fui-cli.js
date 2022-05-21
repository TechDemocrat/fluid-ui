/**
 * CC - CLI
 * @param {string} componentName - name of the component to be created
 * --delete - deletes the component
 * --rename - renames the component with the new name
 *
 */

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

// essentials
const templateName = 'TemplateComponent';
const indexEntryTemplate = `export { TemplateComponent } from './components/TemplateComponent/TemplateComponent';`;
const componentsDirectory = path.resolve(__dirname, '../src/components');
const templateDirectory = path.resolve(componentsDirectory, `./_${templateName}`);
const exportIndexDirectory = path.resolve(__dirname, '../src/index.ts');

// handlers
// check if the component name is valid or not
const isValidComponentName = (componentName) => {
    if (!/^[A-Z][a-zA-Z]+$/.test(componentName)) {
        console.info('Component name should be in PascalCase!');
        process.exit(1);
    }
};

const checkIsComponentExist = (componentName) => {
    // current components
    const components = fs.readdirSync(componentsDirectory);

    // check if the component already exists
    if (components.includes(componentName)) return true;

    return false;
};

// creates the component with the given name
const createComponent = (componentName) => {
    // validate the component to be created
    isValidComponentName(componentName);

    // check if the component already exists
    if (checkIsComponentExist(componentName)) {
        console.info(`Component ${componentName} already exists, use different name!`);
        process.exit(1);
    }

    // create a folder in the componentsDirctory with the name componentName
    const componentToBeCreatedDirectory = path.resolve(componentsDirectory, componentName);

    // create a folder in the componentsDirctory with the name componentName
    fs.mkdirSync(componentToBeCreatedDirectory);

    // read all files from the templateDirectory
    const templateFiles = fs.readdirSync(templateDirectory);

    // iterate over template files and replace any string named with all the occurence of
    // templateName with the name of the componentName and create the file to the componentToBeCreatedDirectory with the componentName name
    const templateNameRegExp = new RegExp(templateName, 'g');
    templateFiles.forEach((templateFile) => {
        const templateFilePath = path.resolve(templateDirectory, templateFile);
        const templateFileContent = fs.readFileSync(templateFilePath, 'utf8');
        const newFileContent = templateFileContent.replace(templateNameRegExp, componentName);
        const newFilePath = path.resolve(
            componentToBeCreatedDirectory,
            templateFile.replace(templateNameRegExp, componentName),
        );
        fs.writeFileSync(newFilePath, newFileContent);
    });

    // add componentName entry in the exportIndexDirectory by replacing the indexEntryTemplate with the componentName name
    const indexEntry = indexEntryTemplate.replace(templateNameRegExp, componentName);
    const indexFileContent = fs.readFileSync(exportIndexDirectory, 'utf8');

    // insert indexEntry at atlast index of the indexFileContent
    const newIndexFileContent = indexFileContent.replace(/\n$/, `\n${indexEntry}\n`);
    fs.writeFileSync(exportIndexDirectory, newIndexFileContent);

    // open the componentName.tsx file with code -g command at 16:12 (at return statement start) position
    exec(`code -g ${componentToBeCreatedDirectory}/${componentName}.tsx:16:12`);
};

// deletes the component with the given name
const deleteComponent = (componentName) => {
    // current components
    const components = fs.readdirSync(componentsDirectory);

    // check if the component exist or not
    if (!components.includes(componentName)) {
        console.info(`Component ${componentName} is not exist, Check component spelling!`);
        process.exit(1);
    }

    // delete the component
    const componentToBeDeletedDirectory = path.resolve(componentsDirectory, componentName);
    fs.rmdirSync(componentToBeDeletedDirectory, { recursive: true });

    // remove the componentName entry from the exportIndexDirectory
    const indexFileContent = fs.readFileSync(exportIndexDirectory, 'utf8');
    const indexEntryRegExp = new RegExp(
        `export { ${componentName} } from './components/${componentName}/${componentName}';`,
        'g',
    );
    const newIndexFileContent = indexFileContent.replace(indexEntryRegExp, '');
    fs.writeFileSync(exportIndexDirectory, newIndexFileContent);

    // exec prettier to format the exportIndexDirectory
    exec(`prettier --write ${exportIndexDirectory}`);
};

// renames the component name with the given name
const renameComponent = (componentName, newComponentName) => {
    // current components
    const components = fs.readdirSync(componentsDirectory);

    // check if the component exist or not
    if (!components.includes(componentName)) {
        console.info(`Component ${componentName} is not exist, Check component spelling!`);
        process.exit(1);
    }

    // check if the new component name is valid
    isValidComponentName(newComponentName);

    // check if the new component already exists
    if (checkIsComponentExist(newComponentName)) {
        console.info(`Component ${newComponentName} already exists, use different name!`);
        process.exit(1);
    }

    // rename the component
    const componentToBeRenamedDirectory = path.resolve(componentsDirectory, componentName);
    const newComponentToBeRenamedDirectory = path.resolve(componentsDirectory, newComponentName);
    fs.renameSync(componentToBeRenamedDirectory, newComponentToBeRenamedDirectory);

    // rename all the files in the componentToBeRenamedDirectory
    const newComponentToBeRenamedDirectoryFiles = fs.readdirSync(newComponentToBeRenamedDirectory);
    const templateNameRegExp = new RegExp(componentName, 'g');
    newComponentToBeRenamedDirectoryFiles.forEach((templateFile) => {
        const templateFilePath = path.resolve(newComponentToBeRenamedDirectory, templateFile);
        const templateFileContent = fs.readFileSync(templateFilePath, 'utf8');
        const newFileContent = templateFileContent.replace(templateNameRegExp, newComponentName);
        const newFilePath = path.resolve(
            newComponentToBeRenamedDirectory,
            templateFile.replace(templateNameRegExp, newComponentName),
        );
        fs.writeFileSync(newFilePath, newFileContent);
        // delete the old file
        fs.unlinkSync(templateFilePath);
    });

    // rename the componentName entry from the exportIndexDirectory
    const indexFileContent = fs.readFileSync(exportIndexDirectory, 'utf8');
    const newIndexFileContentWithNewIndexEntry = indexFileContent.replace(
        templateNameRegExp,
        newComponentName,
    );
    fs.writeFileSync(exportIndexDirectory, newIndexFileContentWithNewIndexEntry);

    // open the newComponentName.tsx file with code -g command at 16:12 (at return statement start) position
    exec(`code -g ${newComponentToBeRenamedDirectory}/${newComponentName}.tsx:16:12`);
};

// main function
const main = () => {
    // get component name from the user
    const componentName = process.argv[2];

    // check if the component name is given
    if (!componentName) {
        console.info('Component name is not given!');
        process.exit(1);
    }

    // check if the command is create, delete or rename
    if (process.argv.includes('--delete')) {
        deleteComponent(componentName);
    } else if (process.argv.includes('--rename')) {
        const newComponentNameIndex = process.argv.indexOf('--rename') + 1;
        renameComponent(componentName, process.argv[newComponentNameIndex]);
    } else {
        createComponent(componentName);
    }
};

main();
