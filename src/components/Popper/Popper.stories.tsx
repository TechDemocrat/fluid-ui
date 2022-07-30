import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Popper } from './Popper';
import { IPopperProps } from './Popper.types';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

export default {
    title: 'fluid-ui/Popper',
    component: Popper,
    argTypes: {},
} as Meta<typeof Popper>;

const Template: Story<IPopperProps> = (args) => <Popper {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: (props) => (
        <div>
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={(e) => props?.onClick?.(e)}
            >
                Menu
            </Button>
        </div>
    ),
    content: () => (
        <Card>
            <div>Home</div>
            <div>About</div>
            <div>Contact</div>
        </Card>
    ),
} as IPopperProps;
