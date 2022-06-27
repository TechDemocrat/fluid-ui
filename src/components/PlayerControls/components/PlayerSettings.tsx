import React from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';
import styles from '../PlayerControls.module.scss';
import { baselineSettings } from '../../../assets/icons/iconify';
import { IPlayerControlsProps } from '../PlayerControls.types';

export const PlayerSettings = (props: IPlayerControlsProps['settings']) => {
    // props
    const { isDisabled } = props;

    // paint
    return (
        <div>
            <Icon
                icon={baselineSettings}
                className={cn(styles.actionIcon, {
                    [styles.iconDisabled]: isDisabled,
                })}
            />
        </div>
    );
};
