import React from 'react';
import { Story, Meta } from '@storybook/react';

import { PlayerControls } from './PlayerControls';
import { IPlayerControlsProps } from './PlayerControls.types';

export default {
    title: 'fluid-ui/PlayerControls',
    component: PlayerControls,
    argTypes: {},
} as Meta<typeof PlayerControls>;

const Template: Story<IPlayerControlsProps> = (args) => (
    <div
        style={{
            width: 800,
            height: 300,
            display: 'grid',
            placeItems: 'end',
            background: '#000000',
        }}
    >
        <PlayerControls {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {} as IPlayerControlsProps;
