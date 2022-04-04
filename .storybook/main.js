const path = require('path');

module.exports = {
    stories: ['../src/**/**/*.stories.mdx', '../src/**/**/*.stories.@(js|jsx|ts|tsx)'],
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
