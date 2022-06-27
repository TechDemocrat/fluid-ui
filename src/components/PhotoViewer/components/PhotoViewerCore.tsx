import React, { MouseEvent, SyntheticEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from '../PhotoViewer.module.scss';
import { IPhotoViewerProps } from '../PhotoViewer.types';
import { Icon } from '@iconify/react';
import { baselineChevronLeft, baselineChevronRight } from '../../../assets/icons/iconify';

interface IPhotoViewerCoreProps {
    source: IPhotoViewerProps['source'];
    currentSourceIndex: number;
    showControls: boolean;
    onNavigationChange: (direction: 'next' | 'previous') => void;
}

export const PhotoViewerCore = (props: IPhotoViewerCoreProps) => {
    // props
    const { source, currentSourceIndex, showControls, onNavigationChange } = props;

    // state
    const [coreImageSwitch, setCoreImageSwitch] = useState<'top' | 'bottom'>('top');
    const [sourceIndexMapping, setSourceIndexMapping] = useState<{
        previous: number;
        current: number;
    }>({
        previous: currentSourceIndex,
        current: currentSourceIndex,
    });

    // effects
    useEffect(() => {
        if (currentSourceIndex !== sourceIndexMapping.current) {
            setSourceIndexMapping({
                previous: sourceIndexMapping.current,
                current: currentSourceIndex,
            });
            // previousSourceIndex.current = currentSourceIndex;
            if (coreImageSwitch === 'top') {
                setCoreImageSwitch('bottom');
            } else {
                setCoreImageSwitch('top');
            }
        }
    }, [currentSourceIndex, coreImageSwitch, sourceIndexMapping]);

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
    const { src } = source[sourceIndexMapping.current];
    const { src: previousSource } = source[sourceIndexMapping.previous];
    const imageASrc = coreImageSwitch === 'top' ? src : previousSource;
    const imageBSrc = coreImageSwitch === 'bottom' ? src : previousSource;

    // paint
    return (
        <div className={cn(styles.photoViewerCore)}>
            <div className={cn(styles.photoViewerCoreImageWrapper)}>
                <img
                    className={cn(styles.photoViewerCoreImage, {
                        [styles.hidden]: coreImageSwitch === 'bottom',
                        [styles.coreImage]: coreImageSwitch === 'top',
                    })}
                    src={imageASrc}
                    draggable={false}
                    onError={onImageLoadError}
                />
                <img
                    className={cn(styles.photoViewerCoreImage, {
                        [styles.hidden]: coreImageSwitch === 'top',
                        [styles.coreImage]: coreImageSwitch === 'bottom',
                    })}
                    src={imageBSrc}
                    draggable={false}
                    onError={onImageLoadError}
                />
            </div>

            {source.length > 1 && (
                <>
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
                </>
            )}
        </div>
    );
};
