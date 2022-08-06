import React from 'react';
import cn from 'classnames';
import shallow from 'zustand/shallow';

import { IToastProps } from './Toast.types';
import styles from './Toast.module.scss';
import { ToastService } from './Toast.service';
import { useToastStore } from './Toast.store';
import ToastMessage from './components/ToastMessage';

export const Toast = (props: IToastProps) => {
    // props
    const {
        position = 'top-right',
        type: defaultType = 'info',
        duration: defaultDuration = 3000,
    } = props;

    // compute
    const positionClass = ToastService.getPositionClass(position);

    // global store
    const { toastList, close } = useToastStore(
        (store) => ({
            toastList: store.toastList,
            close: store.close,
        }),
        shallow,
    );

    // paint
    return (
        <div className={cn(styles.wrapper, positionClass)}>
            {[...toastList.keys()].map((id) => {
                const {
                    message = '',
                    duration = defaultDuration,
                    type = defaultType,
                } = toastList.get(id) ?? {};
                return (
                    <div
                        key={id}
                        className={cn(
                            styles.toastContainer,
                            {
                                [styles.animateRight]: position.includes('right'),
                            },
                            {
                                [styles.animateLeft]: position.includes('left'),
                            },
                        )}
                    >
                        <ToastMessage
                            key={id}
                            id={id}
                            message={message}
                            duration={duration}
                            type={type}
                            close={close}
                        />
                    </div>
                );
            })}
        </div>
    );
};
