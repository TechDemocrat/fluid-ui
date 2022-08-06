import React, { CSSProperties } from 'react';
import { Icon } from '@iconify/react';
import cn from 'classnames';
import { check, error } from '../../assets/icons/iconify';
import { Spinner } from '../Spinner/Spinner';
import styles from './CircularLoaderWithMessage.module.scss';
// import { CircularLoaderWithMessageService } from './CircularLoaderWithMessage.service';
import { ICircularLoaderWithMessageProps } from './CircularLoaderWithMessage.types';

export const CircularLoaderWithMessage: React.FC<ICircularLoaderWithMessageProps> = (props) => {
    // props
    const {
        message,
        style,
        messageStyle,
        spinnerColor = 'primary',
        loadingState = 'loading',
        size = 'medium',
        loaderTitleGap = 20,
        direction = 'vertical',
    } = props;

    // compute
    // const formattedTitle = CircularLoaderWithMessageService.getTitle(title);
    const wrapperStyle: CSSProperties = {
        gap: loaderTitleGap,
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        ...(style ?? {}),
    };

    // paint
    return (
        <div className={cn(styles.wrapper)} style={wrapperStyle}>
            {loadingState === 'loading' && <Spinner size={size} color={spinnerColor} />}
            {loadingState === 'loaded' && (
                <Icon icon={check} className={cn(styles.icon, styles.success)} inline />
            )}
            {loadingState === 'error' && (
                <Icon icon={error} className={cn(styles.icon, styles.danger)} inline />
            )}
            {message && (
                <div
                    className={cn(styles.message, { [styles.messageSmall]: size === 'small' })}
                    style={messageStyle}
                >
                    {message}
                </div>
            )}
        </div>
    );
};
