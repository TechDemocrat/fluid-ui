import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TemplateComponent } from './TemplateComponent';
import { ITemplateComponentProps } from './TemplateComponent.types';

export default {
    title: 'fluid-ui/TemplateComponent',
    component: TemplateComponent,
    argTypes: {},
} as ComponentMeta<typeof TemplateComponent>;

const Template: ComponentStory<typeof TemplateComponent> = (args) => (
    <TemplateComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {} as ITemplateComponentProps;
