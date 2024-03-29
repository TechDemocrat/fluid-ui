import { RefObject, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

// types
// function overloading for different types of event emitter
/**
 * Hybrid event listener which handles both window and DOM eventsFF
 *
 * ```typescript
 *  import React, { useRef } from 'react'
 *  import { useEventListener } from './'
 *
 *  export default function Component() {
 *    // Define button ref
 *    const buttonRef = useRef<HTMLButtonElement>(null)
 *    const onScroll = (event: Event) => {
 *      cons*le.log('window scrolled!', event)
 *    }
 *    const onClick = (event: Event) => {
 *      cons*le.log('button clicked!', event)
 *    }
 *    // example with window based event
 *    useEventListener('scroll', onScroll, true)
 *    // example with element based event
 *    useEventListener('click', onClick, true, buttonRef)
 *    return (
 *      <div style={{ minHeight: '200vh' }}>
 *        <button ref={buttonRef}>Click me</button>
 *      </div>
 *    )
 *  }
 *
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    listen: boolean,
): void;

export function useEventListener<
    K extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLDivElement,
>(
    eventName: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    listen: boolean,
    element: RefObject<T>,
): void;

export function useEventListener<
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap,
    T extends HTMLElement | void = void,
>(
    eventName: KW | KH,
    handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event) => void,
    listen: boolean,
    element?: RefObject<T>,
) {
    // Create a ref that stores handler
    const savedHandler = useRef(handler);

    useIsomorphicLayoutEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        // Define the listening target
        const targetElement: T | Window = element?.current || window;

        if (!(targetElement && targetElement.addEventListener)) {
            return;
        }

        // Create event listener that calls handler function stored in ref
        const eventListener: typeof handler = (event) => savedHandler.current(event);

        if (listen) {
            targetElement.addEventListener(eventName, eventListener);
        } else {
            targetElement.removeEventListener(eventName, eventListener);
        }

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element, listen]);
}
