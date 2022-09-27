/* eslint-disable @typescript-eslint/naming-convention */
import { cloneDeep } from 'lodash';
import { formKey } from '../../utilities';
import { IBaseRecord, ITempDBTelemetry } from './TempDB.types';

export class TempDB {
    static instance: TempDB;

    private isTelemetryActive: boolean;

    static getInstance() {
        if (!TempDB.instance) {
            TempDB.instance = new TempDB();
        }

        return TempDB.instance;
    }

    private memory: Record<string, IBaseRecord[]>;

    constructor() {
        this.memory = {};
        this.isTelemetryActive = false;
    }

    // utils

    // telemetry
    toggleTelemetry = (isActive?: boolean) => {
        const result = isActive ?? !this.isTelemetryActive;

        this.telemetry({ action: 'toggleTelemetry', result, input: { isActive } });
        this.isTelemetryActive = result;
    };

    private telemetry = (props: Partial<ITempDBTelemetry> = {}) => {
        if (this.isTelemetryActive) {
            // eslint-disable-next-line no-console
            console.groupCollapsed(`TempDB Telemetry - ${props.action}`);
            // eslint-disable-next-line no-console
            Object.keys(props).forEach((key) => console.log(key, props[key as keyof typeof props]));
            // eslint-disable-next-line no-console
            console.log('memory', this.memory);
            // eslint-disable-next-line no-console
            console.groupEnd();
        }
    };

    // attach TempDB to window object
    exposeToWindowToggle = (expose = true) => {
        let result = '';
        if (typeof window !== 'undefined') {
            if (expose) {
                (<typeof window & { TempDB: typeof TempDB }>window).TempDB = TempDB;
                result = 'TempDB exposed to window object';
            } else {
                (<typeof window & { TempDB: typeof TempDB | null }>window).TempDB = null;
                result = 'TempDB window object access revoked';
            }
        }
        this.telemetry({ action: 'exposeToWindowToggle', result, input: { expose } });
    };

    // memory
    /**
     * @caution - do not mutate memory object, since this is just for reference purpose, not for mutation
     */
    getMemory() {
        const result = this.memory;
        this.telemetry({ action: 'getMemory', result });
        return result;
    }

    clearMemory() {
        this.memory = {};
        this.telemetry({ action: 'clearMemory' });
        return `Memory cleared successfully`;
    }

    // collection
    createCollection(collectionName: string, collection = []) {
        this.memory[collectionName] = collection;
        const result = this.memory[collectionName];
        this.telemetry({ action: 'createCollection', collectionName, result });
        return result;
    }

    hasCollection(collectionName: string): boolean {
        const result = this.memory[collectionName] !== undefined;
        this.telemetry({ action: 'hasCollection', collectionName, result });
        return result;
    }

    getCollection<V extends IBaseRecord[]>(collectionName: string, clone = false): V {
        if (!this.hasCollection(collectionName)) {
            this.createCollection(collectionName);
        }
        let result: V;
        if (clone) {
            result = <V>cloneDeep(this.memory[collectionName]);
        } else {
            result = <V>this.memory[collectionName];
        }

        this.telemetry({ action: 'getCollection', collectionName, result, input: { clone } });
        return result;
    }

    deleteCollection(collectionName: string) {
        delete this.memory[collectionName];
        const result = `Collection '${collectionName}' deleted successfully`;

        this.telemetry({ action: 'deleteCollection', collectionName, result });
        return result;
    }

    // insert
    private sanitizeRecords<R extends IBaseRecord[]>(records: R): R {
        return <R>records.map((record) => {
            const _id = record._id ?? formKey();
            return { ...record, _id };
        });
    }

    /**
     *
     * Transforms record in the form to send it to user
     */
    private transformRecord<R extends IBaseRecord[]>(records: R): R {
        return records.map((record) => {
            const newRecord = { ...record };
            const id = newRecord._id;
            delete newRecord._id;
            return { ...newRecord, id } as R[0];
        }) as R;
    }

    insertOne<R extends IBaseRecord>(collectionName: string, record: R): R {
        const formattedRecord = this.sanitizeRecords([record])[0];
        this.getCollection(collectionName).push(formattedRecord);
        const result = this.transformRecord([formattedRecord])[0];

        this.telemetry({ action: 'insertOne', collectionName, result });
        return result;
    }

    insertMany<R extends IBaseRecord[]>(collectionName: string, records: R): R {
        const formattedRecords = this.sanitizeRecords(records);
        this.getCollection(collectionName).push(...formattedRecords);
        const result = this.transformRecord(formattedRecords);

        this.telemetry({ action: 'insertMany', collectionName, result });
        return result;
    }

    // update
    updateOne<R extends IBaseRecord>(
        collectionName: string,
        query: Partial<IBaseRecord>,
        updateFunction: (record: R) => void,
    ): R {
        const record = this.findOne<R>(collectionName, query, true);
        updateFunction(record);
        const result = this.transformRecord([record])[0];

        this.telemetry({ action: 'updateOne', collectionName, query, result });
        return result;
    }

    updateMany<R extends IBaseRecord[]>(
        collectionName: string,
        query: Partial<IBaseRecord>,
        updateFunction: (record: R[0]) => void,
    ): R {
        const records = this.findMany<R>(collectionName, query, true);
        records.forEach((record) => updateFunction(record));
        const result = this.transformRecord(records);

        this.telemetry({ action: 'updateMany', collectionName, query, result });
        return result;
    }

    updateAll<R extends IBaseRecord[]>(
        collectionName: string,
        updateFunction: (record: R[0]) => void,
    ): R {
        const records = this.getCollection<R>(collectionName);
        records.forEach((record) => updateFunction(record));
        const result = this.transformRecord(records);

        this.telemetry({ action: 'updateAll', collectionName, result });
        return result;
    }

    // find
    findById<R extends IBaseRecord>(collectionName: string, id: string): R | undefined {
        const record = <R>this.getCollection(collectionName).find((item) => item._id === id);
        const result = this.transformRecord([record])[0];

        this.telemetry({ action: 'findById', collectionName, result, input: { id } });
        return result;
    }

    findOne<R extends IBaseRecord>(
        collectionName: string,
        query: Partial<IBaseRecord>,
        unTransformedResult = false,
    ): R {
        const keys = Object.keys(query);
        const record = <R>this.getCollection(collectionName).find((item) => {
            return keys.find((key) => item[key] === query[key]);
        });
        const result = unTransformedResult ? record : this.transformRecord([record])[0];

        this.telemetry({ action: 'findOne', collectionName, query, result });
        return result;
    }

    findIndices<R extends number[]>(
        collectionName: string,
        query: Partial<IBaseRecord>,
        multi = false,
    ): R {
        const indices: number[] = [];
        const keys = Object.keys(query);
        const records = this.getCollection(collectionName);
        for (let i = 0; i < records.length; i++) {
            const currentRecord = records[i];
            const found = keys.find((key) => currentRecord[key] === query[key]);
            if (found) {
                indices.push(i);
                if (!multi) {
                    break;
                }
            }
        }
        const result = <R>indices;

        this.telemetry({ action: 'findIndices', collectionName, query, result, input: { multi } });
        return result;
    }

    findMany<R extends IBaseRecord[]>(
        collectionName: string,
        query: Partial<IBaseRecord>,
        unTransformedResult = false,
    ): R {
        const keys = Object.keys(query);
        const records = <R>this.getCollection(collectionName).reduce(
            (resultRecords, currentRecord) => {
                const found = keys.find((key) => currentRecord[key] === query[key]);
                if (found) {
                    resultRecords.push(currentRecord);
                }
                return resultRecords;
            },
            <IBaseRecord[]>[],
        );

        const result = unTransformedResult ? records : this.transformRecord(records);

        this.telemetry({ action: 'findMany', collectionName, query, result });
        return result;
    }

    // delete
    deleteOne<R extends IBaseRecord>(
        collectionName: string,
        query: Partial<IBaseRecord>,
    ): R | undefined {
        const indices = this.findIndices(collectionName, query);
        let result: R | undefined;
        if (indices.length > 0) {
            const indexToBeDeleted = indices[0];
            const records = this.getCollection(collectionName);
            const deletedRecord = cloneDeep(records[indexToBeDeleted]);
            records.splice(indexToBeDeleted, 1);

            result = <R>this.transformRecord([deletedRecord])[0];
        }

        this.telemetry({ action: 'deleteOne', collectionName, query, result });
        return result;
    }

    deleteMany<R extends IBaseRecord[]>(
        collectionName: string,
        query: Partial<IBaseRecord>,
    ): R | undefined {
        const indices = this.findIndices(collectionName, query, true);
        let result: R | undefined;

        if (indices.length > 0) {
            const deletedRecords: IBaseRecord[] = [];
            indices.forEach((indexToBeDeleted) => {
                const records = this.getCollection(collectionName);
                const deletedRecord = cloneDeep(records[indexToBeDeleted]);
                deletedRecords.push(deletedRecord);
                records.splice(indexToBeDeleted, 1);
            });

            result = <R>this.transformRecord(deletedRecords);
        }

        this.telemetry({ action: 'deleteMany', collectionName, query, result });
        return result;
    }

    deleteAll(collectionName: string) {
        this.memory[collectionName] = [];

        const result = `Cleared all record from the collection ${collectionName}`;

        this.telemetry({ action: 'deleteAll', collectionName, result });
        return result;
    }
}
