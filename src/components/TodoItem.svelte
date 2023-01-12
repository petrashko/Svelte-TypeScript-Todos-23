<script context="module" lang="ts">
    //console.log('Hello from module');
    let state: number = 5;
</script>

<script lang="ts">
    import { onMount, getContext, hasContext } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { linear } from 'svelte/easing';
    import { fade, fly, blur } from 'svelte/transition';
    import { interpolateLab } from 'd3-interpolate';
    import type { DispatchOptions } from 'svelte/internal';
    import type { Tweened } from 'svelte/motion';
    //
    import { draggable } from '../actions/draggable';
    import { skew } from '../transitions/skew';
    //
    import type { IUser } from '../utils/getTodos';

    export let title: string;
    export let done: boolean;

    const user: IUser | undefined = getContext<IUser>('todo_user');
    //console.log( hasContext('todo_user') );

    // '#faf792': Начальное значение
    const doneMotion: Tweened<string> = tweened('#faf792', {
        delay: 0, // Задержка в мс
        duration: 300, // Продолжительность в мс
        easing: linear, // Функция плавности перехода
        interpolate: (from, to) => (t: number): string => {
            // t изменятся от 0 до 1 (за время duration)
            //return t < 0.5 ? from : to;
            return interpolateLab(from, to)(t);
        }
    });

    onMount(() => {
        doneMotion.set(done ? '#64ad80' : '#faf792');
        return () => {}
    });

    type DispatcherType = <EventKey extends string>(type: EventKey, detail?: any, options?: DispatchOptions) => boolean;
    const dispatch: DispatcherType = createEventDispatcher();

    function handleRemoveClick(ev: Event): void {
        dispatch('removeTodo');
    }

    const handleDoneChange = (ev: Event): void => {
        const cheched: boolean = (ev.target as HTMLInputElement).checked;
        doneMotion.set(cheched ? '#64ad80' : '#faf792');

        //
        dispatch('doneChange', {done: (ev.target as HTMLInputElement).checked});
    }

    /**** Drag and Drop ****/

    interface ICoords {
        x: number;
        y: number
    }

    let coords: ICoords = {x: 0, y: 0};

    function handleDragStart() {}

    function handleDragMove(ev: DragEvent) {
        interface IDetail {
            x: number;
            y: number;
            dx: number;
            dy: number;
        }

        coords = {
            x: coords.x + (ev.detail as unknown as IDetail).dx,
            y: coords.y + (ev.detail as unknown as IDetail).dy
        }
    }

    function handleDragEnd() {
        coords = {x: 0, y: 0};
    }
</script>

<!-- for div
    transition:fade="{{duration: 3000}}" - самая простая
    // Или
    in:fly="{{x: -200, duration: 1000}}"
    out:blur="{{amount: 20, duration: 1000}}"
    // Кастомная анимация
    in:skew="{{duration: 1000}}"use:draggable="{{offset: 0}}"
 -->
<div
    class="main-container"
    style="
        background-color: {$doneMotion};
        transform: translate({coords.x}px, {coords.y}px);
    "
    use:draggable="{{offset: 0}}"
    on:dragstart={handleDragStart}
    on:drag={handleDragMove}
    on:dragend={handleDragEnd}
>
    <!-- Работаем через bind
    <input type="checkbox" bind:checked={done} />
    -->
    <input type="checkbox" checked={done} on:click={handleDoneChange} />
    <p>{user.name}!</p>
    <p class="title">{title}</p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="remove-button" on:click={handleRemoveClick}>Remove</p>
</div>

<style>
    .main-container {
        display: flex;
        height: 50px;
        border-radius: 5px;
        align-items: center;
        background-color: darkseagreen;
        padding: 0 15px;
        user-select: none;
    }

    input {
        margin: 0;
        margin-right: 20px;
    }

    p {
        margin: 0;
    }

    .title {
        flex: 1;
    }

    .remove-button {
        color: brown;
        font-weight: 700;
        cursor: pointer;
    }
</style>
