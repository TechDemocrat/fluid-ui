import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

import { IBlogEditorProps } from './BlogEditor.types';
import styles from './BlogEditor.module.scss';
import BlogEditorJS, { OutputData } from '@editorjs/editorjs';
import { BlogEditorService } from './BlogEditor.service';
import Undo from 'editorjs-undo';

export const BlogEditor = (props: IBlogEditorProps) => {
    // props
    const { title, data, onSave } = props;
    // local state
    const [editorData, setBlogEditorData] = React.useState<OutputData>(data);
    // refs
    const ejInstance = useRef<BlogEditorJS>();

    const tools = BlogEditorService.getTools();

    const initBlogEditor = () => {
        const editor = new BlogEditorJS({
            holder: 'editor-js',
            data: editorData,
            onReady: () => {
                ejInstance.current = editor;
                const undo = new Undo({ editor });
                undo.initialize(data);
            },
            onChange: async () => {
                const content = (await ejInstance?.current?.save()) as OutputData;
                setBlogEditorData(content);
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
            initBlogEditor();
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
