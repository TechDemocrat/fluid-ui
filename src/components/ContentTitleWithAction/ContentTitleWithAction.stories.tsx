import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentTitleWithAction } from './ContentTitleWithAction';
import { IContentTitleWithActionProps } from './ContentTitleWithAction.types';
import { EContentType } from '../ContentTypeFlag/ContentTypeFlag.types';

export default {
    title: 'fluid-ui/ContentTitleWithAction',
    component: ContentTitleWithAction,
    argTypes: {},
} as Meta<typeof ContentTitleWithAction>;

const Template: Story<IContentTitleWithActionProps> = (args) => (
    <div style={{ width: '100%', height: 'auto', display: 'grid', placeItems: 'center' }}>
        <div style={{ width: '60%', height: 'auto' }}>
            <ContentTitleWithAction {...args} />
        </div>
    </div>
);

export const Default = Template.bind({});
Default.args = {
    title: 'The Content tile for the video',
    contentActionGroupOptions: {
        love: {
            active: true,
            onClick: () => {},
        },
        comment: {
            onClick: () => {},
        },
        share: {
            onClick: () => {},
        },
    },
    contentType: EContentType.VIDEO,
    publishedAt: '2020-01-01T00:00:00.000Z',
    duration: '10:40',
} as IContentTitleWithActionProps;
