export type TToastType = 'info' | 'success' | 'warning' | 'error';

export interface IToastProps {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /**
     * @default info
     */
    type?: TToastType;
    /**
     * in ms
     * @default 3000
     */
    duration?: number;
}

export interface IToastLists {
    message: string | React.ReactNode;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    /**
     * @protected
     */
    show?: boolean;
}

export interface IToastState {
    toastList: Map<string, IToastLists>;
    show: (config: IToastLists) => void;
    close: (id: string) => void;
    closeSudden: (id: string) => void;
    closeAllToasts: () => void;
}

export interface IToastMessageProps {
    id: string;
    message: string | React.ReactNode;
    duration: number;
    type: TToastType;
    close: (id: string) => void;
}
