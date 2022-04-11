import React from 'react';
import { Story, Meta } from '@storybook/react';

import { HorizontalRule } from './HorizontalRule';
import { IHorizontalRuleProps } from './HorizontalRule.types';

export default {
    title: 'fluid-ui/HorizontalRule',
    component: HorizontalRule,
    argTypes: {},
} as Meta<typeof HorizontalRule>;

const Template: Story<IHorizontalRuleProps> = (args) => <HorizontalRule {...args} />;

export const Default = Template.bind({});
Default.args = {} as IHorizontalRuleProps;
