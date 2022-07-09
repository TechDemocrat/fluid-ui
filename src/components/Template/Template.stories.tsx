import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Template } from './Template';
import { ITemplateProps } from './Template.types';

export default {
    title: 'fluid-ui/Template',
    component: Template,
    argTypes: {},
} as ComponentMeta<typeof Template>;

const Story: ComponentStory<typeof Template> = (args) => <Template {...args} />;

export const Default = Story.bind({});
Default.args = {} as ITemplateProps;
