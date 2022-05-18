import React, { Reducer, useEffect, useReducer, useState } from 'react';
import { Story, Meta } from '@storybook/react';

import { ImageUploader } from './ImageUploader';
import { IImageUploaderProps, IUploadProgress } from './ImageUploader.types';

export default {
    title: 'fluid-ui/ImageUploader',
    component: ImageUploader,
    argTypes: {},
} as Meta<typeof ImageUploader>;

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
            return { ...state, loaded: state.loaded + 40000 };
        case 'reset':
            return { ...uploadProgressInitialState };
        default:
            return state;
    }
};

// main story
const Template: Story<IImageUploaderProps> = (args) => {
    // props
    const { status } = args;

    // state
    const [currentStatus, setCurrentStatus] = useState(status);
    const [uploadProgress, dispatch] = useReducer(
        uploadProgressReducer,
        uploadProgressInitialState,
    );

    // handlers
    const onUploadHandler = (file: File) => {
        if (file) {
            dispatch({ type: 'reset' });
            setCurrentStatus('uploading');
        }
    };

    // effects
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentStatus === 'uploading') {
                if (uploadProgress.loaded < uploadProgress.total) {
                    dispatch({ type: 'increment' });
                } else {
                    dispatch({ type: 'reset' });
                    setCurrentStatus('uploaded');
                    clearInterval(interval);
                }
            } else {
                clearInterval(interval);
                dispatch({ type: 'reset' });
            }
        }, 200);
        return () => clearInterval(interval);
    }, [currentStatus, uploadProgress]);

    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    // paint
    return (
        <div style={{ width: 500, height: 'auto' }}>
            <ImageUploader
                {...args}
                status={currentStatus}
                uploadProgress={uploadProgress}
                onUpload={onUploadHandler}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    allowedFileTypes: ['image/*'],
} as IImageUploaderProps;
