import React, { useEffect } from 'react';

import { Card } from '../../Card/Card';
import { IconButton } from '../../IconButton/IconButton';
import { Icon } from '@iconify/react';
import styles from '../Toast.module.scss';
import { close as closeIcon } from '../../../utilities/icons/iconify';
import cn from 'classnames';
import { ToastService } from '../Toast.service';

interface Props {
    id: string;
    message: string | React.ReactNode;
    duration: number;
    type: 'info' | 'success' | 'warning' | 'error';
    close: (id: string) => void;
}

const ToastMessage = (props: Props) => {
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
                        <Icon icon={icon} className={styles.uploadCanceIcon} />
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
                        <Icon icon={closeIcon} className={styles.uploadCanceIcon} />
                    </IconButton>
                </div>
            </div>
        </Card>
    );
};

export default ToastMessage;
