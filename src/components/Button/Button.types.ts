export interface IButtonProps {
    /**
     * default variant is `contained`
     **/
    variant: 'text' | 'outlined' | 'contained';
    /**
     * default color is `primary`
     **/
    color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
    /**
     * default size is `medium`
     **/
    size: 'small' | 'medium' | 'large';
    /**
     * default label is `Button`
     **/
    label?: string;
    /**
     * default boolean is `false`
     **/
    disabled?: boolean;
    /**
     * default title will be the label value
     **/
    title?: string;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    /**
     * className to be applied to the base element
     */
    className?: string;
}
