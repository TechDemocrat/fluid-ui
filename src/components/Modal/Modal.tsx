import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { IModalProps } from './Modal.types';
import styles from './Modal.module.scss';
import { ModalService } from './Modal.service';
import { close } from '../../utilities/icons/iconify';
import { Icon } from '@iconify/react';

export const Modal = (props: IModalProps) => {
    // props
    const { title, children, open, onClose } = props;

    // state
    const [show, setShow] = useState(open);

    // effect
    useEffect(() => {
        setShow(open);
    }, [open]);

    useEffect(() => {
        const modal = document.getElementById('modal');
        if (!show) {
            if (modal) {
                modal.addEventListener(
                    'animationend',
                    () => {
                        modal.setAttribute('style', 'display: none');
                    },
                    { once: true },
                );
            }
        } else {
            if (modal) {
                modal.setAttribute('style', 'display: flex');
            }
        }
    }, [show]);

    // handler
    const handleClose = () => {
        setShow(false);
        onClose();
    };

    // compute
    const originalTitle = ModalService.getTitle(title);

    // paint
    return (
        <div
            id="modal"
            className={cn(styles.modalWrapper, { [styles.open]: show }, { [styles.close]: !show })}
        >
            <div className={cn(styles.content)}>
                <div className={cn(styles.heading)}>
                    <div className={cn(styles.title)}>{originalTitle}</div>
                    <div className={cn(styles.icon)} onClick={handleClose}>
                        <Icon icon={close} color="#000000" className={cn(styles.icon)} />
                    </div>
                </div>
                <div className={cn(styles.body)}>{children}</div>
            </div>
        </div>
    );
};
