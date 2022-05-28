import React, { useRef, useState } from 'react';
import { Story, Meta } from '@storybook/react';

import { ImageUploader } from './ImageUploader';
import { IImageUploaderProps, IImageUploaderContent } from './ImageUploader.types';

export default {
    title: 'fluid-ui/ImageUploader',
    component: ImageUploader,
    argTypes: {},
} as Meta<typeof ImageUploader>;

// main story
const Template: Story<IImageUploaderProps> = (args) => {
    // state
    const [conent, setContent] = useState<IImageUploaderContent[]>([]);

    // refs
    const queue = useRef<IImageUploaderContent[]>([]);
    const uploadServiceTimeoutRef = useRef<Record<string, NodeJS.Timer>>({});

    const onDeleteHandler = (id: string) => {
        clearInterval(uploadServiceTimeoutRef.current[id]);
        delete uploadServiceTimeoutRef.current[id];
        const currentUploadProgress = conent.filter((progress) => progress.id !== id);
        setContent(currentUploadProgress);
    };

    const initiateUpload = (id: string, file: File) => {
        const uploadSpeed = 1000; // in ms
        const uploadRate = 10000; // bytes
        const timer = setInterval(() => {
            setContent((currentUploadProgress) => {
                const newUploadProgress = [...currentUploadProgress];
                const currentUploadProgressIndex = newUploadProgress.findIndex(
                    (progress) => progress.id === id,
                );
                let status = newUploadProgress[currentUploadProgressIndex]?.progress?.status;
                let loaded =
                    (newUploadProgress[currentUploadProgressIndex]?.progress?.loaded ?? 0) +
                    uploadRate;
                loaded = loaded > file.size ? file.size : loaded;
                if (loaded === file.size) {
                    status = 'done';
                    clearInterval(uploadServiceTimeoutRef.current[id]); // simulates the post request rejection
                    delete uploadServiceTimeoutRef.current[id];
                }
                newUploadProgress[currentUploadProgressIndex] = {
                    ...newUploadProgress[currentUploadProgressIndex],
                    progress: {
                        ...newUploadProgress[currentUploadProgressIndex].progress,
                        status,
                        loaded,
                    } as IImageUploaderContent['progress'],
                };
                return newUploadProgress;
            });
        }, uploadSpeed);
        uploadServiceTimeoutRef.current[id] = timer;
    };

    const processQueue = () => {
        if (queue.current.length > 0) {
            while (queue.current.length > 0) {
                const currentUploadProgress = queue.current.shift();
                if (currentUploadProgress?.id) {
                    initiateUpload(
                        currentUploadProgress.id ?? '',
                        currentUploadProgress.progress?.file as File,
                    );
                }
            }
        }
    };

    const onUploadHandler = (files: File[]) => {
        const currentUploadProgress: IImageUploaderContent[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            const id = Date.now().toString();
            currentUploadProgress.push({
                url,
                id,
                uploadedAt: new Date().toISOString(),
                progress: {
                    status: 'uploading',
                    loaded: 0,
                    total: file.size,
                    file,
                },
            });
        }
        setContent([...conent, ...currentUploadProgress]);
        queue.current.push(...currentUploadProgress);
        processQueue();
    };

    // paint
    return (
        <div style={{ width: 500, height: 'auto' }}>
            <ImageUploader
                {...args}
                content={conent}
                onUpload={onUploadHandler}
                onDelete={onDeleteHandler}
                allowMultiple
                viewMode="edit"
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    allowedFileTypes: ['image/*'],
} as IImageUploaderProps;
