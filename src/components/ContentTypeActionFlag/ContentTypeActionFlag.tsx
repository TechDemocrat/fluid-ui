import React, { CSSProperties } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';

import styles from './ContentTypeActionFlag.module.scss';
import { IContentTypeActionFlagProps } from './ContentTypeActionFlag.types';
// import { ContentTypeActionFlagService } from './ContentTypeActionFlag.service';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { ContentTypeFlagService } from '../ContentTypeFlag/ContentTypeFlag.service';

export const ContentTypeActionFlag = (props: IContentTypeActionFlagProps) => {
    // props
    const { type } = props;

    // hooks
    const {
        theme: { colors },
    } = useTheme();

    // compute
    const { color, icon, label } = ContentTypeFlagService.getContentTypeMeta(colors, type);

    // styles
    const wrapperStyle: CSSProperties = {
        backgroundColor: color,
    };

    // paint
    return (
        <div className={cn(styles.wrapper)} style={wrapperStyle}>
            <Icon icon={icon} className={cn(styles.icon)} />
            <span className={cn(styles.text)}>{label}</span>
        </div>
    );
};
