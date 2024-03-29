import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Description } from './Description';
import { IDescriptionProps } from './Description.types';

export default {
    title: 'fluid-ui/Description',
    component: Description,
    argTypes: {},
} as ComponentMeta<typeof Description>;

const Story: ComponentStory<typeof Description> = (args) => (
    <Description {...args}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popular in the 1960s with the release of Let sheets containing Lorem Ipsum passages,
        and more recently with desktop publishing software like PageMaker including versions of
        Lorem Ipsum.
    </Description>
);

export const Default = Story.bind({});
Default.args = {} as IDescriptionProps;
