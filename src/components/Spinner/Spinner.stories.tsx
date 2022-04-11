import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Spinner } from './Spinner';
import { ISpinnerProps } from './Spinner.types';

export default {
    title: 'fluid-ui/Spinner',
    component: Spinner,
    argTypes: {},
} as Meta<typeof Spinner>;

const Template: Story<ISpinnerProps> = (args) => <Spinner {...args} />;

export const Default = Template.bind({});
Default.args = {} as ISpinnerProps;
