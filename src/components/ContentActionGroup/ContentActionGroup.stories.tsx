import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentActionGroup } from './ContentActionGroup';
import { IContentActionGroupProps } from './ContentActionGroup.types';

export default {
    title: 'fluid-ui/ContentActionGroup',
    component: ContentActionGroup,
    argTypes: {},
} as Meta<typeof ContentActionGroup>;

const Template: Story<IContentActionGroupProps> = (args) => <ContentActionGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
    size: 'small',
    options: {
        love: {
            active: true,
            onClick: () => {},
        },
        comment: {
            onClick: () => {},
        },
        reply: {
            onClick: () => {},
        },
        share: {
            onClick: () => {},
        },
    },
} as IContentActionGroupProps;
