import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

import { IEditorProps } from './Editor.types';
import styles from './Editor.module.scss';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EditorService } from './Editor.service';

export const Editor = (props: IEditorProps) => {
    // props
    const { title, data, onSave } = props;
    // local state
    const [editorData, setEditorData] = React.useState<OutputData>(data);
    // refs
    const ejInstance = useRef<EditorJS>();

    const tools = EditorService.getTools();

    const initEditor = () => {
        const editor = new EditorJS({
            holder: 'editor-js',
            data: editorData,
            onReady: () => {
                ejInstance.current = editor;
            },
            onChange: async () => {
                const content = (await ejInstance?.current?.save()) as OutputData;
                setEditorData(content);
            },
            autofocus: true,
            tools: tools,
            tunes: ['textVariant'],
            minHeight: 0,
        });
    };

    // Effects
    useEffect(() => {
        if (!ejInstance.current) {
            initEditor();
        }
    });

    // useEffect to save the data every 20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            onSave(editorData);
        }, 20000);
        return () => clearInterval(interval);
    }, [editorData, onSave]);

    // paint
    return (
        <div className={cn(styles.wrapper)} title={title}>
            <div id="editor-js" className={styles.editorjs}>
                {' '}
            </div>
        </div>
    );
};
