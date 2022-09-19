import React, { useEffect, useState } from 'react';
import { Story, Meta } from '@storybook/react';

import { ContentUploader } from './ContentUploader';
import { IContentUploaderProps, IUploadContentMeta } from './ContentUploader.types';
import { UploadService } from '../../services/UploadService/Upload.Service';
import { IContentSource } from '../ImageUploader/ImageUploader.types';
import { IUploadServiceProgressMeta } from '../../services/UploadService/UploadService.types';
import { useIsMounted } from '../../hooks';

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
    const isMounted = useIsMounted();
    const initialContentSource: IContentSource = {
        id: '',
        location: 'local',
        status: 'uploading',
        type: '',
    };
    const [contentSource, setContentSource] = useState<IContentSource>(initialContentSource);
    const [currentStatus, setCurrentStatus] = useState(status);

    // handlers
    const onUploadDone = (progressMeta: IUploadServiceProgressMeta[]) => {
        const currentProgressMeta = progressMeta[0];
        if (isMounted()) {
            setCurrentStatus('uploaded');
            setContentSource({
                id: currentProgressMeta.uploadId,
                location: 'remote',
                status: 'uploaded',
                type: currentProgressMeta.fileType,
                src: currentProgressMeta.url,
            });
        }
    };

    const onUploadHandler = (file: File) => {
        const { uploadId: currentUploadId } = UploadService.getInstance().upload(
            { file },
            {
                onAllUploadsDoneInCurrentScope: onUploadDone,
                simulate: true,
                simulateOptions: { uploadSpeed: 100, uploadRate: 70000 },
            },
        );
        setContentSource({
            id: currentUploadId,
            location: 'local',
            status: 'uploading',
            type: file.type,
        });
        setCurrentStatus('uploading');
    };

    const onCancelHandler = () => {
        UploadService.getInstance().cancelUpload(contentSource.id);
        setContentSource(initialContentSource);
        setCurrentStatus('idle');
    };

    const onDeleteHandler = () => {
        setCurrentStatus('idle');
    };

    // effects
    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    // compute
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
                contentSource={contentSource}
                onUploadCancel={onCancelHandler}
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
