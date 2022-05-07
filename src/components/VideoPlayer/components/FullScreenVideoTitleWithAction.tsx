import React from 'react';
import cn from 'classnames';
import { ContentActionGroup } from '../../ContentActionGroup/ContentActionGroup';
import { IContentActionGroupOptions } from '../../ContentActionGroup/ContentActionGroup.types';
import styles from '../VideoPlayer.module.scss';

interface IFullScreenVideoTitleWithActionProps {
    title: string;
    actionGroupOptions: IContentActionGroupOptions;
    show: boolean;
}

export const FullScreenVideoTitleWithAction = (props: IFullScreenVideoTitleWithActionProps) => {
    // props
    const { title, actionGroupOptions, show } = props;

    // paint
    return (
        <div
            className={cn(styles.fullScreenVideoTitleWithActionWrapper, {
                [styles.showVideoTitleWithAction]: show,
            })}
        >
            <div className={styles.fullScreenVideoTitle}>{title}</div>
            <ContentActionGroup options={actionGroupOptions} size="large" theme="secondary" />
        </div>
    );
};
