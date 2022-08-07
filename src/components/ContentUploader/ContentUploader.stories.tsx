import React, { useEffect, useState } from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentUploader } from './ContentUploader';
import {
    IContentUploaderProps,
    IUploadContentMeta,
    IContentUploadProgress,
} from './ContentUploader.types';
import { UploadService } from '../../services/UploadService/UploadService';
import { useUploadProgress } from '../../hooks/useUploadProgress';

export default {
    title: 'fluid-ui/ContentUploader',
    component: ContentUploader,
    argTypes: {},
} as Meta<typeof ContentUploader>;

// main story
const Template: Story<IContentUploaderProps> = (args) => {
    // props
    const { status } = args;

    // state
    const [uploadId, setUploadId] = useState<string>('');
    const [currentStatus, setCurrentStatus] = useState(status);
    const progress = useUploadProgress(uploadId);

    // handlers
    const onUploadHandler = (file: File) => {
        const currentUploadId = UploadService.getInstance().upload(file, {
            simulate: true,
            simulateOptions: { uploadSpeed: 100, uploadRate: 70000 },
        });
        setUploadId(currentUploadId);
        setCurrentStatus('uploading');
    };

    const onCancelHandler = () => {
        UploadService.getInstance().cancelUpload(uploadId);
        setUploadId('');
        setCurrentStatus('idle');
    };

    const onDeleteHandler = () => {
        setCurrentStatus('idle');
    };

    // effects
    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    useEffect(() => {
        if (uploadId && progress.status === 'uploaded') {
            setCurrentStatus('uploaded');
            setUploadId('');
        }
    }, [progress, uploadId]);

    // compute
    const uploadProgress: IContentUploadProgress | undefined =
        currentStatus === 'uploading'
            ? {
                  loaded: progress.current,
                  total: progress.total,
                  fileName: progress.fileName,
                  onCancel: onCancelHandler,
              }
            : undefined;

    const uploadedContentMeta: IUploadContentMeta | undefined =
        currentStatus === 'uploaded'
            ? {
                  previewArea: () => <div>Preview area</div>,
                  uploadedAt: Date.now().toString(),
                  onDelete: onDeleteHandler,
              }
            : undefined;

    // paint
    return (
        <div style={{ width: 500, height: 'auto' }}>
            <ContentUploader
                {...args}
                status={currentStatus}
                uploadProgress={uploadProgress}
                onUpload={onUploadHandler}
                uploadedContentMeta={uploadedContentMeta}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    allowedFileTypes: ['video/*'],
} as IContentUploaderProps;
