import React, { MouseEvent } from 'react';
import cn from 'classnames';
import styles from '../PhotoViewer.module.scss';
import { IPhotoViewerProps } from '../PhotoViewer.types';

interface IPhotoViewerStackProps {
    source: IPhotoViewerProps['source'];
    currentSourceIndex: number;
    onSourceIndexChange: (index: number) => void;
}

export const PhotoViewerStack = (props: IPhotoViewerStackProps) => {
    // props
    const { source, currentSourceIndex, onSourceIndexChange } = props;

    // handlers
    const stackNodeOnClick = (index: number) => (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onSourceIndexChange(index);
    };

    // paint
    return (
        <div className={styles.photoViewerStackWrapper}>
            <div className={styles.photoViewerStack}>
                {source.map((stackNode, index) => (
                    <div
                        className={cn(styles.photoViewerstackNode, {
                            [styles.photoViewerstackNodeActive]: index === currentSourceIndex,
                        })}
                        onClick={stackNodeOnClick(index)}
                        key={stackNode.src}
                    >
                        {/* stack node progerss block */}
                        <div
                            className={cn(styles.photoViewerstackNodeProgress, {
                                [styles.photoViewerstackNodeProgressFilled]:
                                    index < currentSourceIndex,
                                [styles.photoViewerstackNodeProgressFilling]:
                                    index === currentSourceIndex,
                            })}
                        />
                        <img src={stackNode.src} alt="stack" />
                    </div>
                ))}
            </div>
        </div>
    );
};
