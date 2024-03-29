import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TimeFromNow } from './TimeFromNow';
import { ITimeFromNowProps } from './TimeFromNow.types';

export default {
    title: 'fluid-ui/TimeFromNow',
    component: TimeFromNow,
    argTypes: {},
} as Meta<typeof TimeFromNow>;

const Template: Story<ITimeFromNowProps> = (args) => <TimeFromNow {...args} />;

export const Default = Template.bind({});
Default.args = {
    dateString: '2020-01-01T00:00:00.000Z',
} as ITimeFromNowProps;
