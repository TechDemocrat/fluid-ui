import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Input } from './Input';
import { IInputProps } from './Input.types';

export default {
    title: 'fluid-ui/Input',
    component: Input,
    argTypes: {},
} as Meta<typeof Input>;

const Template: Story<IInputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: '',
    label: 'Content Title',
    autoFocus: true,
    showIcon: true,
    showMessage: true,
} as IInputProps;

export const Tags = Template.bind({});
Tags.args = {
    label: 'Tags',
    type: 'tags',
    size: 'large',
    placeholder: 'Add tags',
    autoFocus: true,
    showIcon: true,
    showMessage: true,
    tags: ['tag1', 'tag2', 'tag3'],
} as IInputProps;
