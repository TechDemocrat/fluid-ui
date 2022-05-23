import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { AudioPlayer } from './AudioPlayer';
import { IAudioPlayerProps } from './AudioPlayer.types';

export default {
    title: 'fluid-ui/AudioPlayer',
    component: AudioPlayer,
    argTypes: {},
} as ComponentMeta<typeof AudioPlayer>;
const Template: ComponentStory<typeof AudioPlayer> = (args) => (
    <div style={{ width: 800, height: 400, overflow: 'hidden' }}>
        <AudioPlayer {...args} />
    </div>
);

export const Default = Template.bind({});

Default.args = {
    source: {
        // long music source url for testing
        src: 'https://pagalworld.com.se/files/download/id/3264',
        type: 'audio/mp3',
        title: 'Shape of You - Ed Sheeran',
        // an artist image from shutter stock
        poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
    },
    actionGroupOptions: {
        love: {
            active: false,
            onClick: () => {},
        },
        comment: {
            onClick: () => {},
        },
        share: {
            onClick: () => {},
        },
    },
    autoPlay: true,
    // sample Music poster image
} as IAudioPlayerProps;
