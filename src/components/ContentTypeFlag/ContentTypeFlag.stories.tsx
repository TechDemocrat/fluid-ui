import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentTypeFlag } from './ContentTypeFlag';
import { EContentType, IContentTypeFlagProps } from './ContentTypeFlag.types';

export default {
    title: 'fluid-ui/ContentTypeFlag',
    component: ContentTypeFlag,
    argTypes: {},
} as Meta<typeof ContentTypeFlag>;

const Template: Story<IContentTypeFlagProps> = (args) => <ContentTypeFlag {...args} />;

export const Video = Template.bind({});
Video.args = { type: EContentType.PHOTO } as IContentTypeFlagProps;
