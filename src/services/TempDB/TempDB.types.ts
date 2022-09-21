import type { TempDB } from './TempDB';

export interface IBaseRecord extends Record<string, unknown> {
    _id?: string;
}

export type TTempDBKeys = keyof typeof TempDB.instance;
