import React, { MouseEvent, useState } from 'react';
import cn from 'classnames';

import { IPlayerControlsProps } from './PlayerControls.types';
import styles from './PlayerControls.module.scss';
import { PlayerControlsService } from './PlayerControls.service';

export const PlayerControls = (props: IPlayerControlsProps) => {
    // props
    const {} = props;

    // state
    const [progressHoverPercent, setProgressHoverPercent] = useState<number>(0);

    // handlers
    const onProgressMouseOver = (e: MouseEvent<HTMLDivElement>) =>
        setProgressHoverPercent(PlayerControlsService.getProgressHoverPercent(e));

    const onProgressMouseLeave = () => setProgressHoverPercent(0);

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <div
                className={cn(styles.progressWrapper)}
                onMouseMove={onProgressMouseOver}
                onMouseOver={onProgressMouseOver}
                onMouseEnter={onProgressMouseOver}
                onMouseLeave={onProgressMouseLeave}
            >
                <div className={cn(styles.progress, styles.progressPadding)} />
                <div className={cn(styles.progress, styles.progressTrack)} />
                <div className={cn(styles.progress, styles.progressBar)} />
                <div className={cn(styles.progress, styles.progressHead)} />
                <div className={cn(styles.progress, styles.progressBuffer)} />
                <div
                    className={cn(styles.progress, styles.progressHover)}
                    style={{
                        width: `${progressHoverPercent * 100}%`,
                    }}
                />
            </div>
            <div className={cn(styles.controlsWrapper)}></div>
        </div>
    );
};
