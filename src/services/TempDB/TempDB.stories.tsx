import React, { useEffect, useMemo, useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { merge } from 'lodash';
import JSON5 from 'json5';
import { TempDB } from './TempDB';
import { IBaseRecord, TTempDBKeys } from './TempDB.types';

const TempDBComponent: React.FC = () => {
    // state
    const [counter, setCounter] = useState(0);
    const [collectionName, setCollectionName] = useState('');
    const [query, setQuery] = useState('');
    const [value, setValue] = useState('');
    const [currentAction, setCurrentAction] = useState<TTempDBKeys>('getMemory');
    const [result, setResult] = useState('');

    // compute
    const tempDB = useMemo(() => TempDB.getInstance(), []);
    const currentMemory = tempDB.getMemory();
    const actionKeys = Object.getOwnPropertyNames(TempDB.prototype).filter(
        (key) => key !== 'constructor',
    ) as TTempDBKeys[];

    // handlers
    const getParsedObject = (currentValue: string, sanitize = false) => {
        try {
            if (!currentValue) return currentValue;

            return JSON5.parse(currentValue);
        } catch (error) {
            if (!sanitize) {
                throw new Error('Value is not valid object');
            } else {
                return currentValue;
            }
        }
    };

    const mergeObject =
        (referenceObject: Partial<IBaseRecord>) => (objectToBeUpdated: IBaseRecord) => {
            return merge(objectToBeUpdated, referenceObject);
        };

    const stringify = (currentValue: unknown) => {
        return JSON.stringify(currentValue);
    };

    const updateResult = (currentValue: unknown) => {
        setResult(stringify(currentValue));
        setCounter((count) => count + 1);
    };

    const onExecute = () => {
        const process = () => {
            const parsedQuery = getParsedObject(query, true);

            switch (currentAction) {
                // memory
                case 'getMemory':
                    return tempDB.getMemory();
                case 'clearMemory':
                    return tempDB.clearMemory();

                // collection
                case 'createCollection':
                    return tempDB.createCollection(collectionName);
                case 'getCollection':
                    return tempDB.getCollection(collectionName);
                case 'hasCollection':
                    return tempDB.hasCollection(collectionName);
                case 'deleteCollection':
                    return tempDB.deleteCollection(collectionName);

                // insert
                case 'insertOne':
                    return tempDB.insertOne(collectionName, getParsedObject(value));
                case 'insertMany':
                    return tempDB.insertMany(collectionName, getParsedObject(value));

                // update
                case 'updateOne':
                    return tempDB.updateOne(
                        collectionName,
                        parsedQuery,
                        mergeObject(getParsedObject(value)),
                    );
                case 'updateMany':
                    return tempDB.updateMany(
                        collectionName,
                        parsedQuery,
                        mergeObject(getParsedObject(value)),
                    );
                case 'updateAll':
                    return tempDB.updateAll(collectionName, mergeObject(getParsedObject(value)));

                // find
                case 'findIndices':
                    return tempDB.findIndices(collectionName, parsedQuery, true);

                case 'findById':
                    return tempDB.findById(collectionName, value);

                case 'findOne':
                    return tempDB.findOne(collectionName, parsedQuery);

                case 'findMany':
                    return tempDB.findMany(collectionName, parsedQuery);

                // delete
                case 'deleteOne':
                    return tempDB.deleteOne(collectionName, parsedQuery);

                case 'deleteMany':
                    return tempDB.deleteMany(collectionName, parsedQuery);

                case 'deleteAll':
                    return tempDB.deleteAll(collectionName);

                default:
                    break;
            }
        };

        return updateResult(process());
    };

    const onTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const targetElement = e.target as HTMLTextAreaElement;
            const start = targetElement.selectionStart;
            const end = targetElement.selectionEnd;
            setValue((currentValue) => {
                return currentValue.substring(0, start) + '\t' + currentValue.substring(end);
            });

            targetElement.selectionEnd = start + 1;
        }
    };

    // effects
    useEffect(() => {
        setResult(stringify(currentMemory));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // paint
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
        >
            <h3>TempDB</h3>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    gap: 20,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        width: '100%',
                        height: '100%',
                        overflow: 'auto',
                    }}
                >
                    <h4>Actions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(1fr, 2)',
                                gap: 5,
                            }}
                        >
                            <h6>Choose Action</h6>
                            <select
                                style={{ height: 35, padding: '0 10px' }}
                                value={currentAction}
                                onChange={(e) => {
                                    setCurrentAction(e.target.value as TTempDBKeys);
                                }}
                            >
                                {actionKeys.map((actionKey) => {
                                    return <option key={actionKey}>{actionKey}</option>;
                                })}
                            </select>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(1fr, 2)',
                                gap: 5,
                            }}
                        >
                            <h6>Collection Name</h6>
                            <input
                                type="text"
                                style={{ height: 35, padding: '0 10px' }}
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                            />
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(1fr, 2)',
                                gap: 5,
                            }}
                        >
                            <h6>Query</h6>
                            <textarea
                                style={{ padding: '10px' }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                rows={5}
                            />
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(1fr, 2)',
                                gap: 5,
                            }}
                        >
                            <h6>Value</h6>
                            <textarea
                                style={{ padding: '10px' }}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                }}
                                onKeyDown={onTextAreaKeyDown}
                                rows={5}
                            />
                        </div>
                        <button style={{ height: 50 }} onClick={onExecute}>
                            <h6>Execute</h6>
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: 10,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateRows: 'auto 1fr',
                            flexDirection: 'column',
                            gap: 10,
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <h4>Memory</h4>
                        <pre
                            style={{
                                width: '100%',
                                height: '100%',
                                padding: 20,
                                textAlign: 'left',
                                backgroundColor: 'lightgray',
                                overflow: 'auto',
                            }}
                        >
                            {counter !== undefined && JSON.stringify(currentMemory, null, 3)}
                        </pre>
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateRows: 'auto 1fr',
                            flexDirection: 'column',
                            gap: 10,
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <h4>Result</h4>
                        <pre
                            style={{
                                width: '100%',
                                height: '100%',
                                padding: 20,
                                textAlign: 'left',
                                backgroundColor: 'lightgray',
                                overflow: 'auto',
                            }}
                        >
                            {counter !== undefined &&
                                JSON.stringify(getParsedObject(result, true), null, 3)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default {
    title: 'fluid-ui/TempDB',
    component: TempDBComponent,
    argTypes: {},
} as Meta<typeof TempDBComponent>;

const Template: Story = (args) => <TempDBComponent {...args} />;

export const Default = Template.bind({});
Default.args = {};
