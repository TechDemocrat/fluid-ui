import React from 'react';
import { Story, Meta } from '@storybook/react';

import { VideoPlayer } from './VideoPlayer';
import { IVideoPlayerProps } from './VideoPlayer.types';

export default {
    title: 'fluid-ui/VideoPlayer',
    component: VideoPlayer,
    argTypes: {},
} as Meta<typeof VideoPlayer>;

const Template: Story<IVideoPlayerProps> = (args) => (
    <div style={{ width: 800, height: 400, overflow: 'hidden' }}>
        <VideoPlayer {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    source: {
        // long video source url for testing
        src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
        type: 'video/mp4',
        title: 'Sample Video',
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
    // sample thumbnail poster for testing
    poster: 'https://media.w3.org/2010/05/sintel/poster.png',
} as IVideoPlayerProps;
