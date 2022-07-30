import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import cn from 'classnames';
import { IPopperProps } from './Popper.types';
import styles from './Popper.module.scss';

export const Popper = (props: IPopperProps) => {
    // props
    const { children, content, placement = 'bottom', className } = props;

    // state
    const [isOpen, setIsOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

    // outside click handler
    const handleOutsideClick = (e: MouseEvent) => {
        if (isOpen && referenceElement && popperElement) {
            if (
                !referenceElement.contains(e.target as Node) &&
                !popperElement.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
    };

    // effect
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    });

    // popper configs
    const { styles: style, attributes } = usePopper(referenceElement, popperElement, {
        placement,
        modifiers: [
            {
                name: 'arrow',
                options: {
                    element: arrowElement,
                },
            },
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['top', 'bottom'],
                },
            },
            {
                name: 'offset',
                options: {
                    offset: [0, 5],
                },
            },
        ],
    });

    // handlers
    const onClick = () => {
        setIsOpen(!isOpen);
    };

    const onHover = () => {
        setIsOpen(!isOpen);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    // paint
    return (
        <div className={cn(styles.popperWrapper, className)}>
            <div ref={setReferenceElement}>{children({ onClick, onHover, isOpen })}</div>
            {isOpen && (
                <>
                    <div ref={setPopperElement} style={style.popper} {...attributes.popper}>
                        {content({ onClose })}
                    </div>
                    <div ref={setArrowElement} style={style.arrow} />
                </>
            )}
        </div>
    );
};
