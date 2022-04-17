import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ProfilePhoto } from './ProfilePhoto';
import { IProfilePhotoProps } from './ProfilePhoto.types';

export default {
    title: 'fluid-ui/ProfilePhoto',
    component: ProfilePhoto,
    argTypes: {},
} as Meta<typeof ProfilePhoto>;

const Template: Story<IProfilePhotoProps> = (args) => (
    <div style={{ width: 120, height: 'auto' }}>
        <ProfilePhoto {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {} as IProfilePhotoProps;
