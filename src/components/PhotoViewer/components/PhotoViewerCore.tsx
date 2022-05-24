import React, { MouseEvent, SyntheticEvent } from 'react';
import cn from 'classnames';
import styles from '../PhotoViewer.module.scss';
import { IPhotoViewerProps } from '../PhotoViewer.types';
import { Icon } from '@iconify/react';
import { baselineChevronLeft, baselineChevronRight } from '../../../utilities/icons/iconify';

interface IPhotoViewerCoreProps {
    source: IPhotoViewerProps['source'];
    currentSourceIndex: number;
    showControls: boolean;
    onNavigationChange: (direction: 'next' | 'previous') => void;
}

export const PhotoViewerCore = (props: IPhotoViewerCoreProps) => {
    // props
    const { source, currentSourceIndex, showControls, onNavigationChange } = props;

    // handlers
    const onNavigationChangeHandler =
        (direction: 'next' | 'previous') => (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            onNavigationChange(direction);
        };

    const onImageLoadError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.style.display = 'none';
    };

    // compute
    const { src } = source[currentSourceIndex];

    // paint
    return (
        <div className={cn(styles.photoViewerCore)}>
            <img
                className={styles.photoViewerCoreImage}
                src={src}
                alt={src}
                draggable={false}
                onError={onImageLoadError}
            />

            <div
                className={cn(
                    styles.photoViewerCoreNavigation,
                    styles.photoViewerCoreNavigationLeft,
                    { [styles.photoViewerCoreNavigationVisible]: showControls },
                )}
                role="button"
                onClick={onNavigationChangeHandler('previous')}
            >
                <Icon icon={baselineChevronLeft} />
            </div>
            <div
                className={cn(
                    styles.photoViewerCoreNavigation,
                    styles.photoViewerCoreNavigationRight,
                    { [styles.photoViewerCoreNavigationVisible]: showControls },
                )}
                role="button"
                onClick={onNavigationChangeHandler('next')}
            >
                <Icon icon={baselineChevronRight} />
            </div>
        </div>
    );
};
