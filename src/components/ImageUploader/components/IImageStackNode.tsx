import React from 'react';
import cn from 'classnames';
import { IImageUploaderContent, IImageUploaderProps } from '../ImageUploader.types';
import styles from '../ImageUploader.module.scss';
import { useUploadProgress } from '../../../utilities/cutomHooks/useUploadProgress';
import { CircularProgress } from '../../CircularProgress/CircularProgress';
import { Icon } from '@iconify/react';
import { closeCircle } from '../../../utilities/icons/iconify';

interface IImageStackNodeProps {
    content: IImageUploaderContent;
    index: number;
    viewMode: IImageUploaderProps['viewMode'];
    previewImageIndex: number;
    onDeleteImage: (content: IImageUploaderContent) => (e: React.MouseEvent<SVGElement>) => void;
    onPreviewImageChange: (index: number) => () => void;
}

export const IImageStackNode = (props: IImageStackNodeProps) => {
    // props
    const { content, previewImageIndex, index, viewMode } = props;
    const { onDeleteImage, onPreviewImageChange } = props;
    const { type, url: remoteUrl, id } = content;

    // hooks
    const { progress, status, url } = useUploadProgress(type === 'local' ? id : undefined) ?? {
        progress: 0,
        status: 'uploaded',
        url: remoteUrl,
    };

    console.log(progress);

    // paint
    return (
        <div
            className={cn(styles.imageStackNode, {
                [styles.imageStackNodeActive]: index === previewImageIndex,
            })}
            onClick={onPreviewImageChange(index)}
        >
            <img className={styles.imageStackImage} src={url} draggable={false} />
            {viewMode === 'edit' && (
                <>
                    {(status === 'uploading' || status === 'waiting') && (
                        <div className={styles.imageStackProgressWrapper}>
                            <CircularProgress
                                radius={25}
                                strokeWidth={3}
                                labelSize={10}
                                currentProgress={progress}
                                totalProgress={100}
                            />
                        </div>
                    )}
                    <Icon
                        className={styles.imageStackNodeDeleteIcon}
                        icon={closeCircle}
                        onClick={onDeleteImage(content)}
                    />
                </>
            )}
        </div>
    );
};
