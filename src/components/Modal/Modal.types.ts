export interface IModalProps {
    title: string;
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
}
