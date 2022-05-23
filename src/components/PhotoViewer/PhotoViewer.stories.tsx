import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { PhotoViewer } from './PhotoViewer';
import { IPhotoViewerProps } from './PhotoViewer.types';

export default {
    title: 'fluid-ui/PhotoViewer',
    component: PhotoViewer,
    argTypes: {},
} as ComponentMeta<typeof PhotoViewer>;

const Template: ComponentStory<typeof PhotoViewer> = (args) => (
    <div style={{ width: 800, height: 400, overflow: 'hidden' }}>
        <PhotoViewer {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {} as IPhotoViewerProps;

Default.args = {
    title: 'Edsheeran - Perfect',
    source: [
        {
            src: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
            type: 'image/png',
            title: 'Shape of You - Ed Sheeran',
        },
        {
            src: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
            type: 'image/png',
            title: 'Shape of You - Ed Sheeran',
        },
        {
            src: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
            type: 'image/png',
            title: 'Shape of You - Ed Sheeran',
        },
        {
            src: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
            type: 'image/png',
            title: 'Shape of You - Ed Sheeran',
        },
    ],
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
} as IPhotoViewerProps;
