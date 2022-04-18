import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ProfileUpload } from './ProfileUpload';
import { IProfileUploadProps } from './ProfileUpload.types';

export default {
    title: 'fluid-ui/ProfileUpload',
    component: ProfileUpload,
    argTypes: {},
} as Meta<typeof ProfileUpload>;

const Template: Story<IProfileUploadProps> = (args) => (
    <div style={{ width: 120, height: 'auto' }}>
        <ProfileUpload {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {} as IProfileUploadProps;
