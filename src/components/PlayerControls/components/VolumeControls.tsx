import React from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import {
    baselineVolumeUp,
    // baselineVolumeDown,
    // baselineVolumeOff,
} from '../../../utilities/icons/iconify';
import styles from '../PlayerControls.module.scss';
import { IPlayerControlsProps } from '../PlayerControls.types';

interface IVolumeControlProps {
    volume: IPlayerControlsProps['volume'];
}
export const VolumeControls = (props: IVolumeControlProps) => {
    // props
    const {
        volume: { isDisabled },
    } = props;

    // paint
    return (
        <div className={styles.volumeControlsWrapper}>
            <Icon
                icon={baselineVolumeUp}
                className={cn(styles.actionIcon, {
                    [styles.iconDisabled]: isDisabled,
                })}
            />
            <div className={styles.volumeSliderWrapper}>
                <div className={styles.volumeSliderTrack} />
                <div className={styles.volumeSliderProgress} />
                <div className={styles.volumeSliderHead} />
            </div>
        </div>
    );
};
