import { clone } from 'lodash';
import create from 'zustand';
import { uuidv4 } from '../../utilities';
import { IToastLists, IToastState } from './Toast.types';

export const useToastStore = create<IToastState>((set, get) => ({
    toastList: new Map<string, IToastLists>(),
    show(config: IToastLists) {
        const { toastList } = get();
        const updatedToastList = clone(toastList);
        updatedToastList.set(uuidv4(), config);
        set({
            toastList: updatedToastList,
        });
    },
    close(toastId: string) {
        const { toastList } = get();
        const newToastList = new Map(toastList);
        newToastList.delete(toastId);
        set({
            toastList: newToastList,
        });
    },
}));
