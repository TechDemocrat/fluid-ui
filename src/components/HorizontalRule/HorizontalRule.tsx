import React from 'react';
import cn from 'classnames';

import { IHorizontalRuleProps } from './HorizontalRule.types';
import styles from './HorizontalRule.module.scss';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export const HorizontalRule = (props: IHorizontalRuleProps) => {
    // props
    const { className, height = 1 } = props;
    // hooks
    const {
        theme: { colors },
    } = useTheme();
    // paint
    return (
        <div
            className={cn(className, styles.wrapper)}
            style={{ borderBottom: `${height}px solid ${colors.foregroundTertiary}` }}
        />
    );
};
