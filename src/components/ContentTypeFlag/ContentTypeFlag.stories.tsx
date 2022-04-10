import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentTypeFlag } from './ContentTypeFlag';
import { IContentTypeFlagProps } from './ContentTypeFlag.types';

export default {
    title: 'fluid-ui/ContentTypeFlag',
    component: ContentTypeFlag,
    argTypes: {},
} as Meta<typeof ContentTypeFlag>;

const Template: Story<IContentTypeFlagProps> = (args) => <ContentTypeFlag {...args} />;

export const Default = Template.bind({});
Default.args = {} as IContentTypeFlagProps;
