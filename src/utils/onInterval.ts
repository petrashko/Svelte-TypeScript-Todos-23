import { onDestroy } from 'svelte';

export function onInterval(cb: () => void, ms: number) {
    const interval: NodeJS.Timer = setInterval(cb, ms);

    onDestroy(() => {
        clearInterval(interval);
    })
}