export interface IToastProps {
    title: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface IToastLists {
    message: string | React.ReactNode;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
}

export interface IToastState {
    toastList: Map<string, IToastLists>;
    show: (config: IToastLists) => void;
    close: (id: string) => void;
}
