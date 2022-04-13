import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Card } from './Card';
import { ICardProps } from './Card.types';

export default {
    title: 'fluid-ui/Card',
    component: Card,
    argTypes: {},
} as Meta<typeof Card>;

const Template: Story<ICardProps> = (args) => (
    <div style={{ width: '300px', height: '300px' }}>
        <Card {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    title: 'Card Title',
    children: <span style={{ fontSize: '14px' }}>Card content</span>,
} as ICardProps;
