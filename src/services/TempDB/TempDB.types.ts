import type { TempDB } from './TempDB';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IBaseRecord extends Record<string | number, any> {
    _id?: string;
}

export type TTempDBKeys = keyof typeof TempDB.instance;

export interface ITempDBTelemetry {
    action: TTempDBKeys;
    collectionName?: string;
    query?: Partial<IBaseRecord>;
    result?: unknown;
    input?: unknown;

    cloneResult?: boolean;
}
