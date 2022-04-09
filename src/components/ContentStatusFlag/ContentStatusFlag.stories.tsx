import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentStatusFlag } from './ContentStatusFlag';
import { IContentStatusFlagProps } from './ContentStatusFlag.types';

export default {
    title: 'fluid-ui/ContentStatusFlag',
    component: ContentStatusFlag,
    argTypes: {},
} as Meta<typeof ContentStatusFlag>;

const Template: Story<IContentStatusFlagProps> = (args) => <ContentStatusFlag {...args} />;

export const Default = Template.bind({});
Default.args = {} as IContentStatusFlagProps;
