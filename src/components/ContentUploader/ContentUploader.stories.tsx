import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentUploader } from './ContentUploader';
import { IContentUploaderProps } from './ContentUploader.types';

export default {
    title: 'fluid-ui/ContentUploader',
    component: ContentUploader,
    argTypes: {},
} as Meta<typeof ContentUploader>;

const Template: Story<IContentUploaderProps> = (args) => (
    <div style={{ width: 500, height: 'auto' }}>
        <ContentUploader {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {} as IContentUploaderProps;
