import React, { useEffect } from 'react';

import { Card } from '../../Card/Card';
import { IconButton } from '../../IconButton/IconButton';
import { Icon } from '@iconify/react';
import styles from '../Toast.module.scss';
import { close as closeIcon } from '../../../assets/icons/iconify';
import cn from 'classnames';
import { ToastService } from '../Toast.service';
import { IToastMessageProps } from '../Toast.types';
import useCountdown from '../../../hooks/useCountDown';

const ToastMessage = (props: IToastMessageProps) => {
    // props
    const { id, message, duration, type, close } = props;
    const icon = ToastService.getIcon(type);

    // hooks
    const [count, { stopCountdown, startCountdown }] = useCountdown({
        countStart: 1,
        countStop: 2,
        intervalMs: duration,
        isIncrement: true,
    });

    // effect
    useEffect(() => {
        startCountdown();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (count === 2) {
            close(id);
        }
    }, [count, id, duration, close]);

    // handlers
    const onMouseOver = () => {
        stopCountdown();
    };

    const onMouseOut = () => {
        startCountdown();
    };

    return (
        <Card className={cn(styles.toastCardWrapper, styles[type])}>
            <div
                className={styles.toastContentWrapper}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
            >
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
