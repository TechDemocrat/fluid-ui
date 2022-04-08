import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TemplateComponent } from './TemplateComponent';
import { ITemplateComponentProps } from './TemplateComponent.types';

export default {
    title: 'fluid-ui/TemplateComponent',
    component: TemplateComponent,
    argTypes: {},
} as Meta<typeof TemplateComponent>;

const Template: Story<ITemplateComponentProps> = (args) => <TemplateComponent {...args} />;

export const Default = Template.bind({});
Default.args = {} as ITemplateComponentProps;
