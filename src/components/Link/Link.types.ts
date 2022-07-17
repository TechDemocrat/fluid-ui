export interface ILinkProps {
    /**
     * if passed anchor tag will be rendered as a link
     * if not passed, will be rendered as a div with role "button"
     */
    href?: string;
    label?: string;
    disabled?: boolean;
    title?: string;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>) => void;
}
