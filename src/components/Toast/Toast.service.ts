import styles from './Toast.module.scss';
import { IToastLists, IToastProps } from './Toast.types';
import { check, info, warning, error } from '../../utilities/icons/iconify';

export class ToastService {
    // actions goes here
    static getTitle = (title: string) => title;

    static getPositionClass = (position: IToastProps['position']) => {
        switch (position) {
            case 'top-left':
                return styles.topLeft;
            case 'top-right':
                return styles.topRight;
            case 'bottom-left':
                return styles.bottomLeft;
            case 'bottom-right':
                return styles.bottomRight;
            default:
                return styles.topRight;
        }
    };

    static getIcon = (type: IToastLists['type']) => {
        switch (type) {
            case 'info':
                return info;
            case 'success':
                return check;
            case 'warning':
                return warning;
            case 'error':
                return error;
            default:
                return info;
        }
    };
}
