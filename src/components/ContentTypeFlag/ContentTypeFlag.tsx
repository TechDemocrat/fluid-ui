import React, { CSSProperties } from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';

import styles from './ContentTypeFlag.module.scss';
import { IContentTypeFlagProps } from './ContentTypeFlag.types';
import { ContentTypeFlagService } from './ContentTypeFlag.service';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export const ContentTypeFlag = (props: IContentTypeFlagProps) => {
    // props
    const { type } = props;

    // hooks
    const {
        theme: { colors },
    } = useTheme();

    // compute
    const contentTypeMeta = ContentTypeFlagService.getContentTypeMeta(colors, type);

    // styles
    const wrapperStyle: CSSProperties = {
        backgroundColor: contentTypeMeta.color,
    };

    // paint
    return (
        <div className={cn(styles.wrapper)} style={wrapperStyle}>
            <Icon icon={contentTypeMeta.icon} className={cn(styles.icon)} />
            <span className={cn(styles.text)}>{contentTypeMeta.label}</span>
        </div>
    );
};
