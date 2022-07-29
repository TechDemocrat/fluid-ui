import React, { useEffect } from 'react';

import { Card } from '../../Card/Card';
import { IconButton } from '../../IconButton/IconButton';
import { Icon } from '@iconify/react';
import styles from '../Toast.module.scss';
import { close as closeIcon } from '../../../assets/icons/iconify';
import cn from 'classnames';
import { ToastService } from '../Toast.service';
import { IToastMessageProps } from '../Toast.types';

const ToastMessage = (props: IToastMessageProps) => {
    // props
    const { id, message, duration, type, close } = props;
    const icon = ToastService.getIcon(type);

    // effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            close(id);
        }, duration);
        return () => {
            clearTimeout(timeout);
        };
    }, [id, duration, close]);

    return (
        <Card className={cn(styles.toastCardWrapper, styles[type])}>
            <div className={styles.toastContentWrapper}>
                <div className={styles.toastIcon}>
                    <IconButton padding={2} title="Close">
                        <Icon icon={icon} className={styles.uploadCancelIcon} />
                    </IconButton>
                </div>
                <div className={styles.toastContent}>{message}</div>
                <div className={styles.toastAction}>
                    <IconButton
                        padding={2}
                        title="Close"
                        onClick={() => {
                            close(id);
                        }}
                    >
                        <Icon icon={closeIcon} className={styles.uploadCancelIcon} />
                    </IconButton>
                </div>
            </div>
        </Card>
    );
};

export default ToastMessage;
