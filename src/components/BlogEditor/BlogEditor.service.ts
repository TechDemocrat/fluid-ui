import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Code from '@editorjs/code';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Underline from '@editorjs/underline';
import TextVariantTune from '@editorjs/text-variant-tune';

export class BlogEditorService {
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
            underline: Underline,
            textVariant: TextVariantTune,
            paragraph: {
                tunes: ['textVariant'],
            },
        };
    };
}
