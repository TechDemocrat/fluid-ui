import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentThumbnail } from './ContentThumbnail';
import { IContentThumbnailProps } from './ContentThumbnail.types';
import { EContentStatusType } from '../ContentStatusFlag/ContentStatusFlag.types';
import { EContentType } from '../ContentTypeFlag/ContentTypeFlag.types';

export default {
    title: 'fluid-ui/ContentThumbnail',
    component: ContentThumbnail,
    argTypes: {},
} as Meta<typeof ContentThumbnail>;

const Template: Story<IContentThumbnailProps> = (args) => <ContentThumbnail {...args} />;

export const Default = Template.bind({});
Default.args = {
    type: EContentType.VIDEO,
    title: 'This is Content Title with two line clamp, which shows ellipsis, if it has more than 2 lines.',
    duration: '10:00',
    publishedTime: '2020-01-01T00:00:00.000Z',
    thumbnailUrl: 'https://via.placeholder.com/150',
    status: EContentStatusType.ON_AIR,
} as IContentThumbnailProps;
