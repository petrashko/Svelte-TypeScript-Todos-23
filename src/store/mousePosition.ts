import { readable } from 'svelte/store';
import type { Readable, StartStopNotifier, Subscriber, Unsubscriber } from 'svelte/store';

export interface IPosition {
    x: number;
    y: number;
}

const cb: StartStopNotifier<IPosition> = (set: Subscriber<IPosition>): Unsubscriber | void => {
    const handler = (ev: MouseEvent) => {
        set({
            x: ev.clientX,
            y: ev.clientY
        });
    }

    document.addEventListener('mousemove', handler);

    return () => {
        document.removeEventListener('mousemove', handler);
    }
};

export const mousePosition: Readable<IPosition> = readable({x: 0, y: 0}, cb);
