import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Comments } from './Comments';
import { ICommentsProps } from './Comments.types';
import data from './data.json';
export default {
    title: 'fluid-ui/Comments',
    component: Comments,
    argTypes: {},
} as Meta<typeof Comments>;

const Template: Story<ICommentsProps> = (args) => (
    <div style={{ display: 'flex', width: '500px' }}>
        <Comments {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    data: data,
} as ICommentsProps;
