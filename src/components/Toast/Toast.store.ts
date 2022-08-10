import create from 'zustand';
import { formKey } from '../../utilities';
import { IToastLists, IToastState } from './Toast.types';

export const useToastStore = create<IToastState>((set, get) => ({
    toastList: new Map<string, IToastLists>(),
    show(config: IToastLists): string {
        const { toastList } = get();
        const toastId = formKey();
        const updatedToastList = new Map([
            ...toastList.entries(),
            [toastId, { ...config, show: true }],
        ]);
        set({
            toastList: updatedToastList,
        });
        return toastId;
    },
    close(toastId: string) {
        // show close animation trick
        const { toastList } = get();
        const newToastList = new Map(toastList);
        const currentToast = newToastList.get(toastId);
        if (currentToast) {
            currentToast.show = false;
        }
        set({
            toastList: newToastList,
        });

        setTimeout(() => {
            useToastStore.getState().closeSudden(toastId);
        }, 500);
    },
    closeSudden(toastId: string) {
        const { toastList } = get();
        const newToastList = new Map(toastList);
        newToastList.delete(toastId);
        set({
            toastList: newToastList,
        });
    },
    closeAllToasts() {
        set({
            toastList: new Map(),
        });
    },
}));

export const showToast = (
    message: IToastLists['message'],
    options?: Pick<IToastLists, 'type' | 'duration'>,
) => {
    useToastStore.getState().show({ message, ...(options ?? {}) });
};

export const closeToast = (toastId: string) => {
    useToastStore.getState().close(toastId);
};

export const closeAllToasts = () => {
    useToastStore.getState().closeAllToasts();
};
