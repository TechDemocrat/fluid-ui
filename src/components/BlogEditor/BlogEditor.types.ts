import { OutputData } from '@editorjs/editorjs';

export interface IBlogEditorProps {
    title?: string;
    data: OutputData;
    onSave: (data: OutputData) => void;
}
