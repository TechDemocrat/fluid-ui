import React from 'react';
import { Story, Meta } from '@storybook/react';

import { BlogViewer } from './BlogViewer';
import { IBlogViewerProps } from './BlogViewer.types';

export default {
    title: 'fluid-ui/BlogViewer',
    component: BlogViewer,
    argTypes: {},
} as Meta<typeof BlogViewer>;

const Template: Story<IBlogViewerProps> = (args) => <BlogViewer {...args} />;

export const Default = Template.bind({});
Default.args = {
    data: {
        time: 1652031233623,
        blocks: [
            {
                id: 'yjtUnMQIi_',
                type: 'header',
                data: {
                    text: 'What is Lorem Ipsum?',
                    level: 2,
                },
            },
            {
                id: 'rMuu8Gbb-4',
                type: 'paragraph',
                data: {
                    text: "Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was  in the 1960s with the release of  sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like  PageMaker including versions of Lorem Ipsum",
                },
            },
        ],
        version: '2.24.2',
    },
} as IBlogViewerProps;
