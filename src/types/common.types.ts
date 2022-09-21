/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * used to derive argument list from the function
 * useful when props needs to be derived from a interface property's function
 */
export type ArgumentsType<T extends (...args: (unknown | any)[]) => unknown | any> = T extends (
    ...args: infer A
) => any
    ? A
    : never;

/**
 * used for any add event listener handlers for preparing callback handler separately (anonymously)
 */
export type TNodeEvent = Event & { target: Node };
export type TEventListenerHandler = (this: Element, event: TNodeEvent) => any;

/**
 * deep partial used to make the object properties partial up to the depth n
 */
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
