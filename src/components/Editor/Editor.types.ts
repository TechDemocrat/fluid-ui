import { OutputData } from '@editorjs/editorjs';

export interface IEditorProps {
    title?: string;
    data: OutputData;
    onSave: (data: OutputData) => void;
}
