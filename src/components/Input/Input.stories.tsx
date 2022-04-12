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
Default.args = {} as IInputProps;
