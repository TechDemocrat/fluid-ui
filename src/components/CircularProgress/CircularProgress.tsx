import React from 'react';

import { ICircularProgressProps } from './CircularProgress.types';
import styles from './CircularProgress.module.scss';
import { CircularProgressService } from './CircularProgress.service';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export const CircularProgress = (props: ICircularProgressProps) => {
    // hooks
    const {
        theme: {
            colors: { primary, primaryLight },
        },
    } = useTheme();

    // props
    const {
        barColor = primary,
        labelSize = 14,
        radius = 50,
        strokeWidth = 5,
        trackColor = primaryLight,
    } = props;
    const { currentProgress = 0, totalProgress = 0 } = props;

    // compute
    const { strokeDashArray, strokeDashOffset } = CircularProgressService.getStorkeDashForProgress(
        radius,
        totalProgress,
        currentProgress,
    );

    // paint
    return (
        <div className={styles.wrapper}>
            <svg
                className={styles.circularProgressContainer}
                width={radius * 2}
                height={radius * 2}
            >
                <circle
                    className={styles.circularProgressTrack}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth}
                    style={{
                        strokeWidth,
                        stroke: trackColor,
                    }}
                ></circle>
                <circle
                    className={styles.circularProgressBar}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth}
                    style={{
                        strokeWidth,
                        strokeDasharray: strokeDashArray,
                        strokeDashoffset: strokeDashOffset,
                        stroke: barColor,
                    }}
                ></circle>
            </svg>
            <div className={styles.circularProgressPercentageLabel} style={{ fontSize: labelSize }}>
                {currentProgress || 0} %
            </div>
        </div>
    );
};
