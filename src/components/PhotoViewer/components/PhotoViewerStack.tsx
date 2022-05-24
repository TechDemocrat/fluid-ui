import React, { CSSProperties, MouseEvent, SyntheticEvent } from 'react';
import cn from 'classnames';
import styles from '../PhotoViewer.module.scss';
import { IPhotoViewerProps } from '../PhotoViewer.types';

interface IPhotoViewerStackProps {
    source: IPhotoViewerProps['source'];
    currentSourceIndex: number;
    progress: number;
    isPlaying: boolean;
    onSourceIndexChange: (index: number) => void;
}

export const PhotoViewerStack = (props: IPhotoViewerStackProps) => {
    // props
    const { source, currentSourceIndex, progress, isPlaying, onSourceIndexChange } = props;

    // handlers
    const stackNodeOnClick = (index: number) => (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onSourceIndexChange(index);
    };

    const onImageLoadError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.style.display = 'none';
    };

    // compute
    const stackNodeProgressStyle: CSSProperties = {
        transform: `scaleX(${progress / 100})`,
    };

    // paint
    return (
        <div className={styles.photoViewerStackWrapper}>
            <div className={styles.photoViewerStack}>
                {source.map((stackNode, index) => {
                    const isCurrentItemIsBeforeSourceIndex = index < currentSourceIndex;

                    const isCurrentIsSourceIndex = index === currentSourceIndex;

                    const isCurrentIndexAndPlaying =
                        isCurrentIsSourceIndex &&
                        (isPlaying || (!isPlaying && progress > 0 && progress <= 100));

                    const isFilled = isCurrentItemIsBeforeSourceIndex;

                    const isFilling = isCurrentIndexAndPlaying;
                    return (
                        <div
                            className={cn(styles.photoViewerstackNode, {
                                [styles.photoViewerstackNodeActive]: index === currentSourceIndex,
                            })}
                            onClick={stackNodeOnClick(index)}
                            key={stackNode.src + index}
                        >
                            {/* stack node progerss block */}
                            <div
                                className={cn(styles.photoViewerstackNodeProgress, {
                                    [styles.photoViewerstackNodeProgressFilled]: isFilled,
                                    [styles.photoViewerstackNodeProgressFilling]: isFilling,
                                })}
                                style={isFilling ? stackNodeProgressStyle : {}}
                            />
                            <img src={stackNode.src} alt="stack" onError={onImageLoadError} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
