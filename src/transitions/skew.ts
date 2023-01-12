import { linear } from 'svelte/easing';

export function skew(node: HTMLElement, { duration }: { duration: number }) {
    return {
        duration,
        css: (t: number): string => {
            const eased = linear(t);
            return `transform: scale(${eased}) skewX(${eased * 180}deg);`;
        }
    }
}
