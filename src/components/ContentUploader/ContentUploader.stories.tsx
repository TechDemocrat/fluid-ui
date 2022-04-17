import React, { useEffect, useReducer } from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentUploader } from './ContentUploader';
import { IContentUploaderProps } from './ContentUploader.types';

export default {
    title: 'fluid-ui/ContentUploader',
    component: ContentUploader,
    argTypes: {},
} as Meta<typeof ContentUploader>;

const Template: Story<IContentUploaderProps> = (args) => {
    // state
    const [progress, dispatch] = useReducer(
        (state: { loaded: number; total: number }, action: { type: string }) => {
            switch (action.type) {
                case 'increment':
                    return { ...state, loaded: state.loaded + 10000 };
                default:
                    return state;
            }
        },
        { loaded: 0, total: 5000000 },
    );

    // effects
    useEffect(() => {
        const interval = setInterval(() => {
            if (progress.loaded < progress.total) {
                dispatch({ type: 'increment' });
            }
        }, 200);
        return () => clearInterval(interval);
    });

    // paint
    return (
        <div style={{ width: 500, height: 'auto' }}>
            <ContentUploader
                {...args}
                status="uploading"
                uploadProgress={{ ...progress, fileName: 'The Content File.mp4' }}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {} as IContentUploaderProps;
