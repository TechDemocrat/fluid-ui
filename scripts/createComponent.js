const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

// essentials
const tempalteName = 'TemplateComponent';
const componentsDirectory = path.resolve(__dirname, '../src/components');
const templateDirectory = path.resolve(componentsDirectory, `./_${tempalteName}`);
const exportIndexDirectory = path.resolve(__dirname, '../src/index.ts');
const indexEntryTemplate = `export { TemplateComponent } from './components/TemplateComponent/TemplateComponent';`;

// read all files from the templateDirectory
const templateFiles = fs.readdirSync(templateDirectory);

// current components
const components = fs.readdirSync(componentsDirectory);

// get new component name from the user
const componentToBeCreated = process.argv[2];

// error check block
if (!componentToBeCreated) {
    console.log('Please enter a component name');
    process.exit(1);
}

// check if the componentToBeCreated is PascalCase
if (!/^[A-Z][a-zA-Z]+$/.test(componentToBeCreated)) {
    console.log('Component name should be PascalCase!');
    process.exit(1);
}

// check if the component already exists
if (components.includes(componentToBeCreated)) {
    console.log(`Component ${componentToBeCreated} already exists, use different name!`);
    process.exit(1);
}

// create a folder in the componentsDirctory with the naem componentToBeCreated
const componentToBeCreatedDirectory = path.resolve(componentsDirectory, componentToBeCreated);

// create a folder in the componentsDirctory with the naem componentToBeCreated
fs.mkdirSync(componentToBeCreatedDirectory);

// iterate over template files and replace any string named with all the occurence of tempalteName with the name of the componentToBeCreated and create the file to the componentToBeCreatedDirectory with the componentToBeCreated name
const templateNameRegExp = new RegExp(tempalteName, 'g');
templateFiles.forEach((templateFile) => {
    const templateFilePath = path.resolve(templateDirectory, templateFile);
    const templateFileContent = fs.readFileSync(templateFilePath, 'utf8');
    const newFileContent = templateFileContent.replace(templateNameRegExp, componentToBeCreated);
    const newFilePath = path.resolve(
        componentToBeCreatedDirectory,
        templateFile.replace(templateNameRegExp, componentToBeCreated),
    );
    fs.writeFileSync(newFilePath, newFileContent);
});

// add componentToBeCreated entry in the exportIndexDirectory by replacing the indexEntryTemplate with the componentToBeCreated name
const indexEntry = indexEntryTemplate.replace(templateNameRegExp, componentToBeCreated);
const indexFileContent = fs.readFileSync(exportIndexDirectory, 'utf8');
// insert indexEntry at atlast index of the indexFileContent
const newIndexFileContent = indexFileContent.replace(/\n$/, `\n${indexEntry}\n`);
fs.writeFileSync(exportIndexDirectory, newIndexFileContent);

// open the componentToBeCreated.tsx file with code -g command at 16:12 (at return statement start) position
exec(`code -g ${componentToBeCreatedDirectory}/${componentToBeCreated}.tsx:16:12`);
