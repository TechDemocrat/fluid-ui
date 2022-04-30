import React, { DragEvent, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import styles from '../PlayerControls.module.scss';
import { IPlayerControlsProps } from '../PlayerControls.types';
import { PlayerControlsService } from '../PlayerControls.service';
import { useLocalStorage } from '../../../utilities/cutomHooks';

interface IVolumeControlProps {
    volume: IPlayerControlsProps['volume'];
}
export const VolumeControls = (props: IVolumeControlProps) => {
    // props
    const {
        volume: { isDisabled, currentLevel, isMuted, onChange },
    } = props;

    // hooks
    const [persistedVolume, setPersistedVolume] = useLocalStorage('volume', {
        currentLevel,
        isMuted,
    });

    // refs
    const volumeTrackRef = useRef<HTMLDivElement>(null);

    // state
    const [volumePercentage, setVolumePercentage] = useState(currentLevel);

    // handlers
    // volume head handlers
    const setEmptyDragElement = (e: DragEvent<HTMLDivElement>) => {
        const emptyElement = document.createElement('img');
        e.dataTransfer.setDragImage(emptyElement, 0, 0); // remove drag image
    };
    const onVolumeHeadDragStart = (e: DragEvent<HTMLDivElement>) => {
        setEmptyDragElement(e);
    };
    const onVolumeHeadDrag = (e: DragEvent<HTMLDivElement>) => {
        setEmptyDragElement(e);
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercentage(
            e,
            volumeTrackRef.current as HTMLDivElement,
        );
        setVolumePercentage(dragPercentage);
    };
    const onVolumeHeadDragEnd = (e: MouseEvent<HTMLDivElement>) => {
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercentage(
            e,
            volumeTrackRef.current as HTMLDivElement,
        );
        setVolumePercentage(dragPercentage);
        onChange?.(dragPercentage); // call callback from props to notify parent
        setPersistedVolume({ ...persistedVolume, currentLevel: dragPercentage });
    };

    const onVolumeIconClick = useCallback(() => {
        if (persistedVolume.isMuted) {
            const persistedLevel = persistedVolume.currentLevel;
            setVolumePercentage(persistedLevel);
            onChange?.(persistedLevel);
            setPersistedVolume({ currentLevel: persistedLevel, isMuted: false });
        } else {
            setPersistedVolume({ currentLevel: volumePercentage, isMuted: true });
            // mute action and volume revoke action needs to be implemented
            setVolumePercentage(0);
            onChange?.(0); // call callback from props to notify parent
        }
    }, [
        volumePercentage,
        persistedVolume.currentLevel,
        persistedVolume.isMuted,
        setPersistedVolume,
        onChange,
    ]);

    // compute
    const volumeIcon = useMemo(
        () => PlayerControlsService.getVolumeIcon(volumePercentage),
        [volumePercentage],
    );

    // paint
    return (
        <div className={styles.volumeControlsWrapper}>
            <Icon
                icon={volumeIcon}
                className={cn(styles.actionIcon, {
                    [styles.iconDisabled]: isDisabled,
                })}
                onClick={onVolumeIconClick}
            />
            <div className={styles.volumeSliderWrapper} onClick={onVolumeHeadDragEnd}>
                <div className={styles.volumeSliderTrack} ref={volumeTrackRef} />
                <div
                    className={styles.volumeSliderProgress}
                    style={{
                        width: `${volumePercentage}%`,
                    }}
                />
                <div
                    draggable
                    className={styles.volumeSliderHead}
                    style={{
                        left: `${volumePercentage}%`,
                    }}
                    onDragStart={onVolumeHeadDragStart}
                    onDrag={onVolumeHeadDrag}
                    onDragEnd={onVolumeHeadDragEnd}
                />
                <div className={styles.volumeSliderPadding} />
            </div>
            <div className={styles.volumneControlsPadding} />
        </div>
    );
};
