import React from 'react';
import { Icon } from '@iconify/react';
import cn from 'classnames';
import { check, error } from '../../assets/icons/iconify';
import { Spinner } from '../Spinner/Spinner';
import styles from './CircularLoaderWithMessage.module.scss';
// import { CircularLoaderWithMessageService } from './CircularLoaderWithMessage.service';
import { ICircularLoaderWithMessageProps } from './CircularLoaderWithMessage.types';

export const CircularLoaderWithMessage: React.FC<ICircularLoaderWithMessageProps> = (props) => {
    // props
    const { message, style, loadingState = 'loading', size = 'medium' } = props;

    // compute
    // const formattedTitle = CircularLoaderWithMessageService.getTitle(title);

    // paint
    return (
        <div className={cn(styles.wrapper)} style={style}>
            {loadingState === 'loading' && <Spinner size={size} color="primary" />}
            {loadingState === 'loaded' && (
                <Icon icon={check} className={cn(styles.icon, styles.success)} inline />
            )}
            {loadingState === 'error' && (
                <Icon icon={error} className={cn(styles.icon, styles.danger)} inline />
            )}
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
};
