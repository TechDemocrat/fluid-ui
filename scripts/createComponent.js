const path = require('path');
const fs = require('fs');

// essentials
const tempalteName = 'TemplateComponent';
const componentsDirectory = path.resolve(__dirname, '../src/components');
const templateDirectory = path.resolve(componentsDirectory, `./_${tempalteName}`);

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
templateFiles.forEach((templateFile) => {
    const templateFilePath = path.resolve(templateDirectory, templateFile);
    const templateFileContent = fs.readFileSync(templateFilePath, 'utf8');
    const templateNameRegExp = new RegExp(tempalteName, 'g');
    const newFileContent = templateFileContent.replace(templateNameRegExp, componentToBeCreated);
    const newFilePath = path.resolve(
        componentToBeCreatedDirectory,
        templateFile.replace(templateNameRegExp, componentToBeCreated),
    );
    fs.writeFileSync(newFilePath, newFileContent);
});
