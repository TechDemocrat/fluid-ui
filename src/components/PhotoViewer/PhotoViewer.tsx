import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { IPhotoViewerProps } from './PhotoViewer.types';
import styles from './PhotoViewer.module.scss';
import videoStyles from '../VideoPlayer/VideoPlayer.module.scss';
import {
    PlayerAccessibilityLayer,
    TAccessibilityType,
} from '../VideoPlayer/components/PlayerAccesibilityLayer';
import {
    useClickHandler,
    useEventListener,
    useIsMouseIdle,
    useProgressTimer,
} from '../../utilities/cutomHooks';
import { PhotoViewerControls } from './components/PhotoViewerControls';
import { PhotoViewerCore } from './components/PhotoViewerCore';
import { PhotoViewerStack } from './components/PhotoViewerStack';
import { FullScreenVideoTitleWithAction } from '../VideoPlayer/components/FullScreenVideoTitleWithAction';
import { UnderlayGradientContainer } from '../VideoPlayer/components/UnderlayGradientContainer';
// import { PhotoViewerService } from './PhotoViewer.service';

export const PhotoViewer = (props: IPhotoViewerProps) => {
    // props
    const { title, source = [], actionGroupOptions = {}, autoPlay = false } = props;

    // refs
    const photoViewerWrapperRef = useRef<HTMLDivElement>(null);

    // state
    const [isLoading, setIsLoading] = useState(true);
    // const [isPhotosReady, setIsPhotosReady] = useState(false);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [accessiblityActionType, setAccessiblityActionType] = useState<TAccessibilityType>(null);

    // custom hooks
    const isMouseIdle = useIsMouseIdle(photoViewerWrapperRef);
    const onProgressDone = () => {
        if (currentSourceIndex === source.length - 1) {
            setIsPlaying(false);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            onNavigationChangeHandler('next');
        }
    };

    const { progress, start, pause, resume, reset } = useProgressTimer(100, 1, 50, onProgressDone);

    // effects
    // on ready loader hide
    useEffect(() => {
        setIsLoading(false);
        if (autoPlay && source.length > 0) {
            setIsPlaying(true);
        }
    }, [autoPlay, source]);

    // play pause handler effect
    useEffect(() => {
        if (isPlaying) {
            resume();
        } else {
            pause();
        }
    }, [isPlaying, pause, resume]);

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

    const onFullScreenClick = () => {
        setIsFullScreen(!isFullScreen);
    };

    const onSourceIndexChangeHandler = (index: number) => {
        let requiredIndex = index;
        if (index < 0) {
            requiredIndex = source.length - 1;
        } else if (index >= source.length) {
            requiredIndex = 0;
        }
        setCurrentSourceIndex(requiredIndex);
        if (isPlaying) {
            start();
        }
    };

    const onNavigationChangeHandler = (direction: 'next' | 'previous') => {
        reset();
        onSourceIndexChangeHandler(
            direction === 'next' ? currentSourceIndex + 1 : currentSourceIndex - 1,
        );
    };

    const onKeyDown = (e: WindowEventMap['keydown']) => {
        if (source.length > 1) {
            if (e.key === 'ArrowRight') {
                onNavigationChangeHandler('next');
                setAccessiblityActionType('seekForward');
            } else if (e.key === 'ArrowLeft') {
                onNavigationChangeHandler('previous');
                setAccessiblityActionType('seekBackward');
            }
        }
    };

    const onPlayPauseClick = () => {
        if (source.length > 1) {
            if (currentSourceIndex === source.length - 1 && progress === 100) {
                onNavigationChangeHandler('next');
            }
            setIsPlaying(!isPlaying);
            setAccessiblityActionType(isPlaying ? 'pause' : 'play');
        }
    };
    const onAccessibilityLayerClick = useClickHandler({
        onSingleClick: onPlayPauseClick,
        onDoubleClick: onFullScreenClick,
    });

    // hooks
    useEventListener('keydown', onKeyDown);

    // compute
    const showTitleWithAction = isFullScreen && !isMouseIdle;
    const showPlayerControls = !isMouseIdle;

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
            <PhotoViewerControls
                showPlayerControls={showPlayerControls}
                sourceLength={source.length}
                currentSourceIndex={currentSourceIndex}
                isPlaying={isPlaying}
                isFullScreen={isFullScreen}
                progress={progress}
                onFullScreenClick={onFullScreenClick}
                onPlayPauseClick={onPlayPauseClick}
            >
                {source.length > 1 && (
                    <PhotoViewerStack
                        source={source}
                        isPlaying={isPlaying}
                        currentSourceIndex={currentSourceIndex}
                        progress={progress}
                        onSourceIndexChange={onSourceIndexChangeHandler}
                    />
                )}
            </PhotoViewerControls>
            {source.length <= 1 && (
                <UnderlayGradientContainer position="bottom" show={showPlayerControls} />
            )}
            <PlayerAccessibilityLayer
                actionType={accessiblityActionType}
                isLoading={isLoading}
                isFullScreen={isFullScreen}
                setActionType={setAccessiblityActionType}
                seekSpeedFormatter={() => `${currentSourceIndex + 1} / ${source.length}`}
            />
        </div>
    );
};
