import React from 'react';
import { Story, Meta } from '@storybook/react';

import { IconButton } from './IconButton';
import { IIconButton } from './IconButton.types';
import { Icon } from '@iconify/react';
import { account } from '../../assets/icons/iconify';

export default {
    title: 'fluid-ui/IconButton',
    component: IconButton,
    argTypes: {},
} as Meta<typeof IconButton>;

const Template: Story<IIconButton> = (args) => <IconButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: <Icon icon={account} />,
} as IIconButton;
