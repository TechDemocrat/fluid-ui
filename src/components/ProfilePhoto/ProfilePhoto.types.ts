export interface IProfilePhotoProps {
    /**
     * title
     * @default ''
     * @example
     * Profile Photo
     */
    title: string;
    /**
     * className
     * @default ''
     * @example
     * 'profile-photo'
     */
    className?: string;
    /**
     * src
     * @default ''
     * @example
     * 'https://via.placeholder.com/150'
     */
    src: string;
    /**
     * alt
     * @default ''
     * @example
     * 'Profile Photo'
     */
    alt?: string;
    /**
     * size
     * @default 'small'
     * @example
     * 'small'
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * onChange
     * @default () => {}
     * @example
     * () => {}
     */
    onChange: (file: File) => void;
}
