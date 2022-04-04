import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Link } from './Link';
import { ILinkProps } from './Link.types';

export default {
    title: 'fluid-ui/Link',
    component: Link,
    argTypes: {},
} as Meta<typeof Link>;

const Template: Story<ILinkProps> = (args) => <Link {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: 'Woah!',
    href: 'https://www.google.com',
} as ILinkProps;
