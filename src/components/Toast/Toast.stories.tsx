import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Toast } from './Toast';
import { IToastProps } from './Toast.types';
import { useToastStore } from './Toast.store';
import shallow from 'zustand/shallow';
import { Button } from '../Button/Button';

export default {
    title: 'fluid-ui/Toast',
    component: Toast,
    argTypes: {},
} as Meta<typeof Toast>;

const Template: Story<IToastProps> = (args) => {
    const { show } = useToastStore(
        (store) => ({
            show: store.show,
        }),
        shallow,
    );

    return (
        <>
            <Toast {...args} />
            <Button
                variant="contained"
                size="small"
                color="info"
                onClick={() =>
                    show({
                        message: 'This is a toast message',
                        type: 'warning',
                    })
                }
            >
                Show toast
            </Button>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    position: 'top-right',
} as IToastProps;
