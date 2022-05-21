import React from 'react';
import cn from 'classnames';

import { IEditorViewerProps } from './EditorViewer.types';
import styles from './EditorViewer.module.scss';
import { EditorViewerService } from './EditorViewer.service';
import edjsHTML from 'editorjs-html';
import parser from 'html-react-parser';
const edjsParser = edjsHTML();

export const EditorViewer = (props: IEditorViewerProps) => {
    // props
    const { title, data } = props;

    // compute
    const originalTitle = EditorViewerService.getTitle(title);
    const htmlData: [] = edjsParser.parse(data);

    // paint
    return (
        <div className={cn(styles.wrapper)} title={originalTitle}>
            {htmlData.map((item) => {
                return parser(item);
            })}
        </div>
    );
};
