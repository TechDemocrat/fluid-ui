import React from 'react';
import cn from 'classnames';

import { IContentActionGroupOptions, IContentActionGroupProps } from './ContentActionGroup.types';
import styles from './ContentActionGroup.module.scss';
import { ContentActionGroupService } from './ContentActionGroup.service';
import { Icon } from '@iconify/react';

export const ContentActionGroup = (props: IContentActionGroupProps) => {
    // props
    const { size = 'medium', options } = props;

    // compute
    const contentActions = ContentActionGroupService.getContentActions(
        options as IContentActionGroupOptions,
    );

    // paint
    return (
        <div
            className={cn(styles.wrapper, {
                [styles.smallGap]: size === 'small',
                [styles.mediumGap]: size === 'medium',
            })}
        >
            {contentActions.map(({ key, icon, label, onClick }) => (
                <div
                    className={cn(styles.actionNode, {
                        [styles.small]: size === 'small',
                        [styles.medium]: size === 'medium',
                    })}
                    onClick={onClick}
                    key={key}
                >
                    <Icon
                        className={cn(styles.actionIcon, {
                            [styles.loveFilledColor]: key === 'love' && options.love?.active,
                        })}
                        icon={icon}
                    />
                    <div className={styles.actionLabel}>{label}</div>
                </div>
            ))}
        </div>
    );
};
