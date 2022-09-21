/* eslint-disable @typescript-eslint/naming-convention */
import { cloneDeep } from 'lodash';
import { formKey } from '../../utilities';
import { IBaseRecord } from './TempDB.types';

export class TempDB {
    static instance: TempDB;

    static getInstance() {
        if (!TempDB.instance) {
            TempDB.instance = new TempDB();
        }

        return TempDB.instance;
    }

    private memory: Record<string, IBaseRecord[]>;

    constructor() {
        this.memory = {};
    }

    // memory
    /**
     * @caution - do not mutate memory object, since this is just for reference purpose, not for mutation
     */
    getMemory() {
        return this.memory;
    }

    clearMemory() {
        this.memory = {};
        return `Memory cleared successfully`;
    }

    // collection
    createCollection(collectionName: string, collection = []) {
        this.memory[collectionName] = collection;
        return this.memory[collectionName];
    }

    hasCollection(collectionName: string): boolean {
        return this.memory[collectionName] !== undefined;
    }

    getCollection<V extends IBaseRecord[]>(collectionName: string, clone = false): V {
        if (!this.hasCollection(collectionName)) {
            this.createCollection(collectionName);
        }
        if (clone) {
            return <V>cloneDeep(this.memory[collectionName]);
        }
        return <V>this.memory[collectionName];
    }

    deleteCollection(collectionName: string) {
        delete this.memory[collectionName];
        return `Collection '${collectionName}' deleted successfully`;
    }

    // insert
    private sanitizeRecords<R extends IBaseRecord[]>(records: R): R {
        return <R>records.map((record) => {
            const _id = record._id ?? formKey();
            return { ...record, _id };
        });
    }

    insertOne<R extends IBaseRecord>(collectionName: string, record: R): R {
        const formattedRecord = this.sanitizeRecords([record])[0];
        this.getCollection(collectionName).push(formattedRecord);
        return formattedRecord;
    }

    insertMany<R extends IBaseRecord[]>(collectionName: string, records: R): R {
        const formattedRecords = this.sanitizeRecords(records);
        this.getCollection(collectionName).push(...formattedRecords);
        return formattedRecords;
    }

    // update
    updateOne<R extends IBaseRecord>(
        collectionName: string,
        queryRecord: Partial<IBaseRecord>,
        updateFunction: (record: R) => void,
    ): R {
        const record = this.findOne<R>(collectionName, queryRecord);
        updateFunction(record);
        return record;
    }

    updateMany<R extends IBaseRecord[]>(
        collectionName: string,
        queryRecord: Partial<IBaseRecord>,
        updateFunction: (record: R[0]) => void,
    ): R {
        const records = this.findMany<R>(collectionName, queryRecord);
        records.forEach((record) => updateFunction(record));
        return records;
    }

    updateAll<R extends IBaseRecord[]>(
        collectionName: string,
        updateFunction: (record: R[0]) => void,
    ): R {
        const records = this.getCollection<R>(collectionName);
        records.forEach((record) => updateFunction(record));
        return records;
    }

    // find
    findById<R extends IBaseRecord>(collectionName: string, id: string): R | undefined {
        return <R>this.getCollection(collectionName).find((item) => item._id === id);
    }

    findOne<R extends IBaseRecord>(collectionName: string, queryRecord: Partial<IBaseRecord>): R {
        const keys = Object.keys(queryRecord);
        return <R>this.getCollection(collectionName).find((item) => {
            return keys.find((key) => item[key] === queryRecord[key]);
        });
    }

    findIndices<R extends number[]>(
        collectionName: string,
        queryRecord: Partial<IBaseRecord>,
        multi = false,
    ): R {
        const indices: number[] = [];
        const keys = Object.keys(queryRecord);
        const records = this.getCollection(collectionName);
        for (let i = 0; i < records.length; i++) {
            const currentRecord = records[i];
            const found = keys.find((key) => currentRecord[key] === queryRecord[key]);
            if (found) {
                indices.push(i);
                if (!multi) {
                    break;
                }
            }
        }
        return <R>indices;
    }

    findMany<R extends IBaseRecord[]>(
        collectionName: string,
        queryRecord: Partial<IBaseRecord>,
    ): R {
        const keys = Object.keys(queryRecord);
        return <R>this.getCollection(collectionName).reduce((records, currentRecord) => {
            const found = keys.find((key) => currentRecord[key] === queryRecord[key]);
            if (found) {
                records.push(currentRecord);
            }
            return records;
        }, <IBaseRecord[]>[]);
    }

    // delete
    deleteOne<R extends IBaseRecord>(
        collectionName: string,
        queryRecord: Partial<IBaseRecord>,
    ): R | undefined {
        const indices = this.findIndices(collectionName, queryRecord);
        if (indices.length > 0) {
            const indexToBeDeleted = indices[0];
            const records = this.getCollection(collectionName);
            const deletedRecord = cloneDeep(records[indexToBeDeleted]);
            records.splice(indexToBeDeleted, 1);

            return <R>deletedRecord;
        }
        return undefined;
    }

    deleteMany<R extends IBaseRecord[]>(
        collectionName: string,
        queryRecord: Partial<IBaseRecord>,
    ): R | undefined {
        const indices = this.findIndices(collectionName, queryRecord, true);
        if (indices.length > 0) {
            const deletedRecords: IBaseRecord[] = [];
            indices.forEach((indexToBeDeleted) => {
                const records = this.getCollection(collectionName);
                const deletedRecord = cloneDeep(records[indexToBeDeleted]);
                deletedRecords.push(deletedRecord);
                records.splice(indexToBeDeleted, 1);
            });

            return <R>deletedRecords;
        }
        return undefined;
    }

    deleteAll(collectionName: string) {
        this.memory[collectionName] = [];

        return `Cleared all record from the collection ${collectionName}`;
    }
}
