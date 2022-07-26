import React from 'react';
import { Story, Meta } from '@storybook/react';
import { IconifyIcon } from '@iconify/types';
import { Icon } from '@iconify/react';
import * as Icons from './index';

const IconfiyIconComponent = ({ icon, label }: { icon: IconifyIcon; label: string }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                padding: 10,
                borderRadius: 5,
                boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)',
            }}
        >
            <Icon style={{ fontSize: 20 }} icon={icon} />
            <div style={{ fontSize: 14 }}>{label}</div>
        </div>
    );
};

export default {
    title: 'fluid-ui/Iconify-Icons',
    component: IconfiyIconComponent,
    argTypes: {},
} as Meta<typeof IconfiyIconComponent>;

const Template: Story = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 5,
                maxWidth: '80%',
                maxHeight: '80%',
                overflow: 'auto',
                flexWrap: 'wrap',
            }}
        >
            {Object.keys(Icons).map((key) => {
                return (
                    <IconfiyIconComponent
                        key={key}
                        label={key}
                        icon={(Icons as Record<string, IconifyIcon>)[key]}
                    />
                );
            })}
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {};
