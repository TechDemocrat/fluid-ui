import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CircularLoaderWithMessage } from './CircularLoaderWithMessage';
import { ICircularLoaderWithMessageProps } from './CircularLoaderWithMessage.types';

export default {
    title: 'fluid-ui/CircularLoaderWithMessage',
    component: CircularLoaderWithMessage,
    argTypes: {},
} as ComponentMeta<typeof CircularLoaderWithMessage>;

const Story: ComponentStory<typeof CircularLoaderWithMessage> = (args) => (
    <CircularLoaderWithMessage {...args} />
);

export const Default = Story.bind({});
Default.args = {} as ICircularLoaderWithMessageProps;
