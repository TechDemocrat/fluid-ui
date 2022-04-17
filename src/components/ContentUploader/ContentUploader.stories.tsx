import React, { Reducer, useEffect, useReducer } from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentUploader } from './ContentUploader';
import { IContentUploaderProps, IUploadProgress } from './ContentUploader.types';

export default {
    title: 'fluid-ui/ContentUploader',
    component: ContentUploader,
    argTypes: {},
} as Meta<typeof ContentUploader>;

// upload progress helpers
const uploadProgressInitialState: Omit<IUploadProgress, 'onCancel'> = {
    loaded: 0,
    total: 5000000,
    fileName: 'The Content file.mp4',
};

const uploadProgressReducer: Reducer<Omit<IUploadProgress, 'onCancel'>, { type: string }> = (
    state,
    action,
) => {
    switch (action.type) {
        case 'increment':
            return { ...state, loaded: state.loaded + 10000 };
        case 'reset':
            return { ...uploadProgressInitialState };
        default:
            return state;
    }
};

// main story
const Template: Story<IContentUploaderProps> = (args) => {
    // props
    const { status } = args;

    // state
    const [uploadProgress, dispatch] = useReducer(
        uploadProgressReducer,
        uploadProgressInitialState,
    );

    // effects
    useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'uploading') {
                if (uploadProgress.loaded < uploadProgress.total) {
                    dispatch({ type: 'increment' });
                }
            } else {
                clearInterval(interval);
                dispatch({ type: 'reset' });
            }
        }, 200);
        return () => clearInterval(interval);
    }, [status, uploadProgress]);

    // paint
    return (
        <div style={{ width: 500, height: 'auto' }}>
            <ContentUploader {...args} uploadProgress={uploadProgress} />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {} as IContentUploaderProps;
