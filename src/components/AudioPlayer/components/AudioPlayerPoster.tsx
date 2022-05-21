import React, { SyntheticEvent } from 'react';
import { IAudioPlayerProps } from '../AudioPlayer.types';
import styles from '../AudioPlayer.module.scss';
import { ContentActionGroup } from '../../ContentActionGroup/ContentActionGroup';

interface IAudioPlayerPosterProps {
    source: IAudioPlayerProps['source'];
    actionGroupOptions: IAudioPlayerProps['actionGroupOptions'];
    isFullScreen: boolean;
}

export const AudioPlayerPoster = (props: IAudioPlayerPosterProps) => {
    // props
    const { source, actionGroupOptions, isFullScreen } = props;
    const { poster, title } = source;

    // handlers
    const onImageLoadError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.style.display = 'none';
    };

    // paint
    return (
        <div className={styles.audioPlayerUIWrapper}>
            <div
                className={styles.audioPlayerPosterWrapper}
                data-fullscreen={isFullScreen ? 'true' : 'false'}
            >
                <div className={styles.audioPoster}>
                    <img
                        src={poster}
                        alt="Audio poster"
                        onError={onImageLoadError}
                        draggable={false}
                    />
                </div>
                {isFullScreen && (
                    <>
                        <div className={styles.audioPosterTitleHolder}>{title}</div>
                        <ContentActionGroup options={actionGroupOptions} theme="secondary" />
                    </>
                )}
            </div>
        </div>
    );
};
