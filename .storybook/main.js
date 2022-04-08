const path = require('path');
const glob = require('glob');

const appDirectory = path.resolve(__dirname, '../src');

const getStories = () =>
    glob.sync(`${appDirectory}/**/**/*.stories.@(js|jsx|ts|tsx|mdx)`, {
        ignore: `${appDirectory}/**/**/Template.stories.@(js|jsx|ts|tsx|mdx)`,
    });

module.exports = {
    stories: async (list) => [...list, ...getStories()],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: '@storybook/react',
    webpackFinal: async (config, { configType }) => {
        config.module.rules.push({
            test: /\.(css|scss)$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: /\.module\.(css|scss)$/,
        });
        config.module.rules.push({
            test: /\.(css|scss)$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            exclude: /\.module\.(css|scss)$/,
        });

        // Return the altered config
        return config;
    },
};
