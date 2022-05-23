import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { IPhotoViewerProps } from './PhotoViewer.types';
import styles from './PhotoViewer.module.scss';
import videoStyles from '../VideoPlayer/VideoPlayer.module.scss';
import {
    PlayerAccessibilityLayer,
    TAccessibilityType,
} from '../VideoPlayer/components/PlayerAccesibilityLayer';
import { useClickHandler, useIsKeyboardIdle, useIsMouseIdle } from '../../utilities/cutomHooks';
import { PhotoViewerControls } from './components/PhotoViewerControls';
import { PhotoViewerCore } from './components/PhotoViewerCore';
import { PhotoViewerStack } from './components/PhotoViewerStack';
import { FullScreenVideoTitleWithAction } from '../VideoPlayer/components/FullScreenVideoTitleWithAction';
import { UnderlayGradientContainer } from '../VideoPlayer/components/UnderlayGradientContainer';
// import { PhotoViewerService } from './PhotoViewer.service';

export const PhotoViewer = (props: IPhotoViewerProps) => {
    // props
    const { title, source = [], autoPlay = true, actionGroupOptions = {} } = props;

    // refs
    const photoViewerWrapperRef = useRef<HTMLDivElement>(null);

    // state
    const [isLoading, setIsLoading] = useState(true);
    // const [isPhotosReady, setIsPhotosReady] = useState(false);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [accessiblityActionType, setAccessiblityActionType] = useState<TAccessibilityType>(null);

    // custom hooks
    const isMouseIdle = useIsMouseIdle(photoViewerWrapperRef);
    const isKeyboardIdle = useIsKeyboardIdle();

    // effects
    // on ready loader hide
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // fullScreen handler effect
    useEffect(() => {
        const photoViewerWrapper = photoViewerWrapperRef.current;
        const handleFullScreenChange = () => {
            // document.fullScreenElement will point to the element that
            // is in fullScreen mode if there is one. If not, the value
            // of the property is null.
            if (document.fullscreenElement) {
                // Entered fullScreen mode.
            } else {
                // Leaving fullScreen mode
                setIsFullScreen(false);
            }
        };

        if (isFullScreen) {
            photoViewerWrapper?.addEventListener('fullscreenchange', handleFullScreenChange);
            photoViewerWrapper?.requestFullscreen().catch(() => {
                setIsFullScreen(false);
            });
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        }

        return () => {
            photoViewerWrapper?.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, [isFullScreen]);

    // handlers
    const onPlayPauseClick = () => {
        setIsPlaying(!isPlaying);
        setAccessiblityActionType(isPlaying ? 'pause' : 'play');
    };

    const onFullScreenClick = () => {
        setIsFullScreen(!isFullScreen);
    };

    const onAccessibilityLayerClick = useClickHandler({
        onSingleClick: onPlayPauseClick,
        onDoubleClick: onFullScreenClick,
    });

    const onSourceIndexChangeHandler = (index: number) => {
        let requiredIndex = index;
        if (index < 0) {
            requiredIndex = source.length - 1;
        } else if (index >= source.length) {
            requiredIndex = 0;
        }
        setCurrentSourceIndex(requiredIndex);
    };

    const onNavigationChangeHandler = (direction: 'next' | 'previous') => {
        onSourceIndexChangeHandler(
            direction === 'next' ? currentSourceIndex + 1 : currentSourceIndex - 1,
        );
    };

    // compute
    const isUserInteracting = !(isMouseIdle && isKeyboardIdle);
    const showTitleWithAction = isFullScreen && isUserInteracting;
    const showPlayerControls = isUserInteracting;

    // paint
    return (
        <div
            className={cn(styles.wrapper, videoStyles.wrapper, {
                [videoStyles.hideCursor]: isMouseIdle,
            })}
            ref={photoViewerWrapperRef}
            onClick={onAccessibilityLayerClick}
        >
            <FullScreenVideoTitleWithAction
                title={title}
                actionGroupOptions={actionGroupOptions}
                show={showTitleWithAction}
            />
            <UnderlayGradientContainer position="top" show={showTitleWithAction} />

            {/* core photo view area */}
            <PhotoViewerCore
                source={source}
                currentSourceIndex={currentSourceIndex}
                showControls={showPlayerControls}
                onNavigationChange={onNavigationChangeHandler}
            />
            {/* photo player controls area */}
            <PhotoViewerControls showPlayerControls={showPlayerControls}>
                <PhotoViewerStack
                    source={source}
                    currentSourceIndex={currentSourceIndex}
                    onSourceIndexChange={onSourceIndexChangeHandler}
                />
            </PhotoViewerControls>
            <PlayerAccessibilityLayer
                actionType={accessiblityActionType}
                isLoading={isLoading}
                isFullScreen={isFullScreen}
                setActionType={setAccessiblityActionType}
            />
        </div>
    );
};
