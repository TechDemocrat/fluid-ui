import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import { ImageUploader } from './ImageUploader';
import { IImageUploaderProps, IContentSource } from './ImageUploader.types';
import { UploadService } from '../../services/UploadService/Upload.Service';

export default {
    title: 'fluid-ui/ImageUploader',
    component: ImageUploader,
    argTypes: {},
} as Meta<typeof ImageUploader>;

// main story
const Template: Story<IImageUploaderProps> = (args) => {
    // state
    const [contents, setContents] = useState<IContentSource[]>(args.contents ?? []);

    const onDeleteHandler = (currentContent: IContentSource) => {
        if (currentContent.location === 'local') {
            setContents(contents.filter((content) => content.id !== currentContent.id));
            if (currentContent.id) UploadService.getInstance().cancelUpload(currentContent.id);
        } else {
            // TODO: delete from cloud
        }
    };

    const onUploadHandler = (files: File[]) => {
        const fileInputs = files.map((file) => ({ file }));
        const { uploadId } = UploadService.getInstance().upload(fileInputs, {
            simulate: true,
        });
        const newContents: IContentSource[] = uploadId.map((currentUploadId, index) => ({
            location: 'local',
            id: currentUploadId,
            status: 'uploading',
            type: files[index].type,
        }));
        setContents([...contents, ...newContents]);
    };

    // paint
    return (
        <div style={{ width: 500, height: 'auto' }}>
            <ImageUploader
                {...args}
                contents={contents}
                onUpload={onUploadHandler}
                onDelete={onDeleteHandler}
                allowMultiple
            />
        </div>
    );
};

export const EditMode = Template.bind({});
EditMode.args = {
    allowedFileTypes: ['image/*'],
    viewMode: 'edit',
} as IImageUploaderProps;

export const ViewMode = Template.bind({});
ViewMode.args = {
    allowedFileTypes: ['image/*'],
    contents: [
        {
            id: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
            src: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png/220px-Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
            location: 'remote',
            status: 'uploaded',
            type: 'image/png',
        },
        {
            id: 'https://picsum.photos/1240/720?random=1',
            src: 'https://picsum.photos/1240/720?random=1',
            location: 'remote',
            status: 'uploaded',
            type: 'image/png',
        },
        {
            id: 'https://picsum.photos/400/300?random=2',
            src: 'https://picsum.photos/400/300?random=2',
            location: 'remote',
            status: 'uploaded',
            type: 'image/png',
        },
        {
            id: 'https://picsum.photos/200/300?random=3',
            src: 'https://picsum.photos/200/300?random=3',
            location: 'remote',
            status: 'uploaded',
            type: 'image/png',
        },
    ],
    viewMode: 'view',
} as IImageUploaderProps;
