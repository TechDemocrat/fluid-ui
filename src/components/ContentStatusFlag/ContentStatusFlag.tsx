import React, { CSSProperties } from 'react';
import cn from 'classnames';

import { IContentStatusFlagProps } from './ContentStatusFlag.types';
import styles from './ContentStatusFlag.module.scss';
import { ContentStatusFlagService } from './ContentStatusFlag.service';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export const ContentStatusFlag = (props: IContentStatusFlagProps) => {
    // props
    const { type } = props;

    // hooks
    const { theme } = useTheme();

    // compute
    const { color, label } = ContentStatusFlagService.getContentStatusFlagMeta(theme.colors, type);

    // styles
    const indicatorStyle: CSSProperties = {
        backgroundColor: color,
    };

    // paint
    return (
        <div className={cn(styles.wrapper)}>
            <span className={styles.indicator} style={indicatorStyle} />
            <span className={styles.text}>{label}</span>
        </div>
    );
};
