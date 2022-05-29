import React, { MouseEvent } from 'react';
import styles from '../ImageUploader.module.scss';
import { IImageUploaderContent, IImageUploaderProps } from '../ImageUploader.types';
import { IImageStackNode } from './IImageStackNode';

interface IImageUploaderImageStackProps {
    viewMode: IImageUploaderProps['viewMode'];
    contents: IImageUploaderContent[];
    previewImageIndex: number;
    onPreviewImageChange: (index: number) => () => void;
    onDeleteImage: (content: IImageUploaderContent) => (e: MouseEvent<SVGElement>) => void;
}

export const ImageUploaderImageStack = (props: IImageUploaderImageStackProps) => {
    // props
    const { viewMode, contents, previewImageIndex, onPreviewImageChange, onDeleteImage } = props;

    // paint
    return (
        <div className={styles.imageStackContainer}>
            {contents.map((content, index) => {
                return (
                    <IImageStackNode
                        key={content.id}
                        content={content}
                        index={index}
                        previewImageIndex={previewImageIndex}
                        viewMode={viewMode}
                        onDeleteImage={onDeleteImage}
                        onPreviewImageChange={onPreviewImageChange}
                    />
                );
            })}
        </div>
    );
};
