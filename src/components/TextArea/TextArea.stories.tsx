import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TextArea } from './TextArea';
import { ITextAreaProps } from './TextArea.types';

export default {
    title: 'fluid-ui/TextArea',
    component: TextArea,
    argTypes: {},
} as Meta<typeof TextArea>;

const Template: Story<ITextAreaProps> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: '@mani: Good one!',
    placeholder: 'Write a comment...',
} as ITextAreaProps;
