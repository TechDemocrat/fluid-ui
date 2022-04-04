import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button } from './Button';
import { IButtonProps } from './Button.types';

export default {
    title: 'fluid-ui/Button',
    component: Button,
    argTypes: {},
} as Meta<typeof Button>;

const Template: Story<IButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: 'Button',
} as IButtonProps;
