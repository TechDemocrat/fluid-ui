import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentTypeActionFlag } from './ContentTypeActionFlag';
import { IContentTypeActionFlagProps } from './ContentTypeActionFlag.types';

export default {
    title: 'fluid-ui/ContentTypeActionFlag',
    component: ContentTypeActionFlag,
    argTypes: {},
} as Meta<typeof ContentTypeActionFlag>;

const Template: Story<IContentTypeActionFlagProps> = (args) => <ContentTypeActionFlag {...args} />;

export const Default = Template.bind({});
Default.args = {} as IContentTypeActionFlagProps;
