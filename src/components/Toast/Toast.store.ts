import create from 'zustand';
import { formKey } from '../../utilities';
import { IToastLists, IToastState } from './Toast.types';

export const useToastStore = create<IToastState>((set, get) => ({
    toastList: new Map<string, IToastLists>(),
    show(config: IToastLists): string {
        const { toastList } = get();
        const toastId = formKey();
        const updatedToastList = new Map([...toastList.entries(), [toastId, config]]);
        set({
            toastList: updatedToastList,
        });
        return toastId;
    },
    close(toastId: string) {
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

export const showToast = (config: IToastLists) => {
    useToastStore.getState().show(config);
};

export const closeToast = (toastId: string) => {
    useToastStore.getState().close(toastId);
};

export const closeAllToasts = () => {
    useToastStore.getState().closeAllToasts();
};
