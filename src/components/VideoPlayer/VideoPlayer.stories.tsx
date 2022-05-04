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
        // sample accessible video mp4
        src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        type: 'video/mp4',
    },
} as IVideoPlayerProps;
