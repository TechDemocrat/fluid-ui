import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ProfileImage } from './ProfileImage';
import { IProfileImageProps } from './ProfileImage.types';

export default {
    title: 'fluid-ui/ProfileImage',
    component: ProfileImage,
    argTypes: {},
} as Meta<typeof ProfileImage>;

const Template: Story<IProfileImageProps> = (args) => <ProfileImage {...args} />;

export const Default = Template.bind({});
Default.args = {} as IProfileImageProps;
