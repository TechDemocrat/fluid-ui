import React from 'react';
import { Story, Meta } from '@storybook/react';

import { CircularProgress } from './CircularProgress';
import { ICircularProgressProps } from './CircularProgress.types';

export default {
    title: 'fluid-ui/CircularProgress',
    component: CircularProgress,
    argTypes: {},
} as Meta<typeof CircularProgress>;

const Template: Story<ICircularProgressProps> = (args) => <CircularProgress {...args} />;

export const Default = Template.bind({});
Default.args = {
    radius: 100,
    totalProgress: 100,
    currentProgress: 90,
} as ICircularProgressProps;
