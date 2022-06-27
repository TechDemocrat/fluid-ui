import React, { Dispatch, DragEvent, MouseEvent, useCallback, useMemo, useRef } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import styles from '../PlayerControls.module.scss';
import { IPlayerControlsProps } from '../PlayerControls.types';
import { PlayerControlsService } from '../PlayerControls.service';
import { TAccessibilityType } from '../../VideoPlayer/components/PlayerAccesibilityLayer';
import { useEventListener } from '../../../hooks';

interface IPlayerVolumeControlsProps {
    volume: IPlayerControlsProps['volume'];
    setAccessiblityActionType: Dispatch<TAccessibilityType>;
}
export const PlayerVolumeControls = (props: IPlayerVolumeControlsProps) => {
    // props
    const {
        volume: { isDisabled, isMuted, currentLevel, previousLevel, onChange, onMute, onUnMute },
        setAccessiblityActionType,
    } = props;

    // refs
    const volumeTrackRef = useRef<HTMLDivElement>(null);

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
        onChange?.(dragPercentage); // call callback from props to notify parent
    };
    const onVolumeHeadDragEnd = (e: MouseEvent<HTMLDivElement>) => {
        const dragPercentage = PlayerControlsService.getProgressHeadDragPercentage(
            e,
            volumeTrackRef.current as HTMLDivElement,
        );
        onChange?.(dragPercentage); // call callback from props to notify parent
    };

    const onVolumeIconClick = useCallback(() => {
        if (!isMuted) {
            onMute();
        } else {
            onUnMute();
        }
    }, [onUnMute, onMute, isMuted]);

    const getUpdatedVolumeLevel = (type: 'up' | 'down') => {
        let updatedValue = currentLevel;
        if (type === 'up') {
            updatedValue = updatedValue + 10;
            updatedValue = updatedValue > 100 ? 100 : updatedValue;
        } else {
            updatedValue = updatedValue - 10;
            updatedValue = updatedValue < 0 ? 0 : updatedValue;
        }
        return updatedValue;
    };

    const setAccessibility = (currentVolumeLevel: number) => {
        if (currentVolumeLevel === 0) {
            setAccessiblityActionType('volumeMute');
        } else if (currentVolumeLevel > 50) {
            setAccessiblityActionType('volumeUp');
        } else {
            setAccessiblityActionType('volumeDown');
        }
    };

    const onKeyDown = (e: WindowEventMap['keydown']) => {
        // if ArrowUp key is pressed and volume is not muted then increase volume by 10%
        // and call callback from props to notify parent to update volume
        // if m key is pressed then mute volume
        if (e.key === 'ArrowUp') {
            const currentVolumeLevel = getUpdatedVolumeLevel('up');
            onChange?.(currentVolumeLevel);
            setAccessibility(currentVolumeLevel);
        } else if (e.key === 'ArrowDown') {
            const currentVolumeLevel = getUpdatedVolumeLevel('down');
            onChange?.(currentVolumeLevel);
            setAccessibility(currentVolumeLevel);
        } else if (e.key === 'm') {
            onVolumeIconClick();
            if (!isMuted) {
                setAccessiblityActionType('volumeMute');
            } else {
                setAccessibility(previousLevel);
            }
        }
    };

    // hooks
    useEventListener('keydown', onKeyDown);

    // compute
    const volumeIcon = useMemo(
        () => PlayerControlsService.getVolumeIcon(currentLevel),
        [currentLevel],
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
            <div
                className={styles.volumeSliderWrapper}
                onClick={onVolumeHeadDragEnd}
                onDragStart={onVolumeHeadDragStart}
                onDrag={onVolumeHeadDrag}
                onDragEnd={onVolumeHeadDragEnd}
            >
                <div className={styles.volumeSliderTrack} ref={volumeTrackRef} />
                <div
                    className={styles.volumeSliderProgress}
                    style={{
                        width: `${currentLevel}%`,
                    }}
                />
                <div
                    draggable
                    className={styles.volumeSliderHead}
                    style={{
                        left: `${currentLevel}%`,
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
