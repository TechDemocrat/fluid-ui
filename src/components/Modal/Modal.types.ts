export interface IModalProps {
    /**
     * title
     * @default ''
     * @type string
     * @example
     * 'Modal'
     */
    title: string;
    /**
     * children
     * @default ''
     * @type React.ReactNode
     * @example
     * <div>Modal</div>
     */
    children: React.ReactNode;
    /**
     * open
     * @default false
     * @type boolean
     * @example
     * true
     */
    open: boolean;
    /**
     * onClose
     * @default () => {}
     * @type Function
     * @example
     * () => {}
     */
    onClose: () => void;
}
