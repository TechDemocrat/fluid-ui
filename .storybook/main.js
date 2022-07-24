const path = require('path');
const glob = require('glob');

const appDirectory = path.resolve(__dirname, '../src');

const getStories = () =>
    glob.sync(`${appDirectory}/**/**/*.stories.@(js|jsx|ts|tsx|mdx)`, {
        // ignore: `${appDirectory}/**/**/Template.stories.@(js|jsx|ts|tsx|mdx)`,
    });

module.exports = {
    stories: async (list) => [...list, ...getStories()],
    /** Expose public folder to storybook as static */
    staticDirs: ['../public'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/preset-scss',
    ],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5',
    },
};
