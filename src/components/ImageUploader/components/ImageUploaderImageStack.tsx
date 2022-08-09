import React, { MouseEvent } from 'react';
import styles from '../ImageUploader.module.scss';
import { IContentSource, IImageUploaderProps } from '../ImageUploader.types';
import { IImageStackNode } from './IImageStackNode';

interface IImageUploaderImageStackProps {
    viewMode: IImageUploaderProps['viewMode'];
    contents: IContentSource[];
    previewImageIndex: number;
    onPreviewImageChange: (index: number) => () => void;
    onDeleteImage: (content: IContentSource) => (e: MouseEvent<SVGElement>) => void;
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
