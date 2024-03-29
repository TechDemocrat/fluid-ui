import React from 'react';
import cn from 'classnames';

import { IBlogViewerProps } from './BlogViewer.types';
import styles from './BlogViewer.module.scss';
import { BlogViewerService } from './BlogViewer.service';
import EditorJSHTML from 'editorjs-html';
import parser from 'html-react-parser';
const EditorJSHTMLParser = EditorJSHTML();

export const BlogViewer = (props: IBlogViewerProps) => {
    // props
    const { title, data } = props;

    // compute
    const originalTitle = BlogViewerService.getTitle(title);
    const htmlData: [] = EditorJSHTMLParser.parse(data);

    // paint
    return (
        <div className={cn(styles.wrapper)} title={originalTitle}>
            {htmlData.map((item) => {
                return parser(item);
            })}
        </div>
    );
};
