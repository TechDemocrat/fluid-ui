import React from 'react';
import { Story, Meta } from '@storybook/react';

import { AudioPlayer } from './AudioPlayer';
import { IAudioPlayerProps } from './AudioPlayer.types';

export default {
    title: 'fluid-ui/AudioPlayer',
    component: AudioPlayer,
    argTypes: {},
} as Meta<typeof AudioPlayer>;
const Template: Story<IAudioPlayerProps> = (args) => (
    <div style={{ width: 800, height: 400, overflow: 'hidden' }}>
        <AudioPlayer {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    source: {
        // long music source url for testing
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        type: 'audio/mp3',
        title: 'Sample Audio',
    },
    actionGroupOptions: {
        comment: {
            onClick: () => {},
        },
        love: {
            active: false,
            onClick: () => {},
        },
        share: {
            onClick: () => {},
        },
    },
    autoPlay: true,
    // sample Music poster image
    poster: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.jpg',
} as IAudioPlayerProps;
