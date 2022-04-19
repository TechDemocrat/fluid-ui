import { MouseEvent } from 'react';

export class PlayerControlsService {
    static getProgressHoverPercent = (e: MouseEvent<HTMLDivElement>): number => {
        const { clientX } = e;
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = (clientX - left) / width;
        return percent;
    };
}
