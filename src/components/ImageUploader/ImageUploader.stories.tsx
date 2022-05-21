import React, { useRef, useState, useEffect } from 'react';
import { Story, Meta } from '@storybook/react';

import { ImageUploader } from './ImageUploader';
import { IImageUploaderProps, IUploadProgress } from './ImageUploader.types';

export default {
    title: 'fluid-ui/ImageUploader',
    component: ImageUploader,
    argTypes: {},
} as Meta<typeof ImageUploader>;

// main story
const Template: Story<IImageUploaderProps> = (args) => {
    // state
    const [uploadProgress, setUploadProgress] = useState<IUploadProgress[]>([]);

    // refs
    const queue = useRef<IUploadProgress[]>([]);
    const uploadServiceTimeoutRef = useRef<Record<string, NodeJS.Timer>>({});

    const onUploadHandler = (files: File[]) => {
        const currentUploadProgress: IUploadProgress[] = [];
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
        queue.current.push(...currentUploadProgress);
        setUploadProgress([...uploadProgress, ...currentUploadProgress]);
    };

    const onDeleteHandler = (index: number) => {
        const currentUploadProgress = [...uploadProgress];
        const deletedImage = currentUploadProgress.splice(index, 1)[0];
        clearInterval(uploadServiceTimeoutRef.current[deletedImage.id]);
        delete uploadServiceTimeoutRef.current[deletedImage.id];
        setUploadProgress(currentUploadProgress);
    };

    // effects
    useEffect(() => {
        const initiateUpload = (id: string, file: File) => {
            const uploadSpeed = 1000; // in ms
            const uploadRate = 10000; // bytes
            const timer = setInterval(() => {
                setUploadProgress((currentUploadProgress) => {
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
                        } as IUploadProgress['progress'],
                    };
                    return newUploadProgress;
                });
            }, uploadSpeed);
            uploadServiceTimeoutRef.current[id] = timer;
        };

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
    }, [uploadProgress, setUploadProgress]);

    // paint
    return (
        <div style={{ width: 500, height: 'auto' }}>
            <ImageUploader
                {...args}
                uploadProgress={uploadProgress}
                onUpload={onUploadHandler}
                onDelete={onDeleteHandler}
                allowMultiple
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    allowedFileTypes: ['image/*'],
} as IImageUploaderProps;
