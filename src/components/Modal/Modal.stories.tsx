import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Modal } from './Modal';
import { IModalProps } from './Modal.types';

export default {
    title: 'fluid-ui/Modal',
    component: Modal,
    argTypes: {},
} as Meta<typeof Modal>;

const Template: Story<IModalProps> = (args) => <Modal {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: 'Modal title',
    open: true,
    children: (
        <div style={{ width: '500px' }}>
            <div>Name:</div>
            <div>
                <input />
            </div>
            <div>
                <button>Submit</button>
            </div>
        </div>
    ),
} as IModalProps;
