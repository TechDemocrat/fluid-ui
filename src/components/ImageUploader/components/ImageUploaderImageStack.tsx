import React, { MouseEvent, useRef } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import styles from '../ImageUploader.module.scss';
import { CircularProgress } from '../../CircularProgress/CircularProgress';
import { ImageUploaderService } from '../ImageUploader.service';
import { IImageUploaderContent, IImageUploaderProps } from '../ImageUploader.types';
import { closeCircle } from '../../../utilities/icons/iconify';

interface IImageUploaderImageStackProps {
    viewMode: IImageUploaderProps['viewMode'];
    content: IImageUploaderContent[];
    previewImageIndex: number;
    onPreviewImageChange: (index: number) => () => void;
    onDeleteImage: (id: string) => (e: MouseEvent<SVGElement>) => void;
}

export const ImageUploaderImageStack = (props: IImageUploaderImageStackProps) => {
    // props
    const { viewMode, content, previewImageIndex, onPreviewImageChange, onDeleteImage } = props;

    // refs
    const previousLoadedRef = useRef<number[]>([]);

    // paint
    return (
        <div className={styles.imageStackContainer}>
            {content.map(({ url, id, progress }, index) => {
                const percentage =
                    viewMode === 'edit'
                        ? ImageUploaderService.getUploadProgressInfo(
                              index,
                              previousLoadedRef,
                              progress,
                          ).percentage
                        : 0;
                return (
                    <div
                        className={cn(styles.imageStackNode, {
                            [styles.imageStackNodeActive]: index === previewImageIndex,
                        })}
                        key={id}
                        onClick={onPreviewImageChange(index)}
                    >
                        <img className={styles.imageStackImage} src={url} draggable={false} />
                        {viewMode === 'edit' && (
                            <>
                                {progress?.status === 'uploading' && (
                                    <div className={styles.imageStackProgressWrapper}>
                                        <CircularProgress
                                            radius={25}
                                            strokeWidth={3}
                                            labelSize={10}
                                            currentProgress={percentage}
                                            totalProgress={100}
                                        />
                                    </div>
                                )}
                                <Icon
                                    className={styles.imageStackNodeDeleteIcon}
                                    icon={closeCircle}
                                    onClick={onDeleteImage(id)}
                                />
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
