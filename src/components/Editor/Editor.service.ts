import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Code from '@editorjs/code';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';

export class EditorService {
    // actions goes here
    static getTitle = (title: string) => title;

    static getTools = () => {
        return {
            header: Header,
            list: List,
            table: Table,
            code: Code,
            image: Image,
            quote: Quote,
        };
    };
}
