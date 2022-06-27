import { MouseEventHandler } from 'react';
import { IconifyIcon } from '@iconify/types';
import { comment, heart, heartOutline, reply, share } from '../../assets/icons/iconify';
import { IContentActionGroupOptions } from './ContentActionGroup.types';

interface IContentAction {
    key: keyof IContentActionGroupOptions;
    label: string;
    icon: IconifyIcon;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export class ContentActionGroupService {
    static getContentActions = (options: IContentActionGroupOptions): IContentAction[] => {
        const actions: IContentAction[] = [];
        const optionKeys = <(keyof IContentActionGroupOptions)[]>Object.keys(options);

        optionKeys.forEach((key) => {
            const action: IContentAction = {
                key,
                label: '',
                icon: null as unknown as IconifyIcon,
                onClick: () => {},
            };

            switch (key) {
                case 'love':
                    action.label = 'Love';
                    action.icon = options.love?.active ? heart : heartOutline;
                    action.onClick = options.love?.onClick ?? (() => {});
                    break;
                case 'comment':
                    action.label = 'Comment';
                    action.icon = comment;
                    action.onClick = options.comment?.onClick ?? (() => {});
                    break;
                case 'share':
                    action.label = 'Share';
                    action.icon = share;
                    action.onClick = options.share?.onClick ?? (() => {});
                    break;
                case 'reply':
                    action.label = 'Reply';
                    action.icon = reply;
                    action.onClick = options.reply?.onClick ?? (() => {});
                    break;
                default:
                    break;
            }

            actions.push(action);
        });

        return actions;
    };
}
