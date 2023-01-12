<script lang="ts">
    import { tick, onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import type { DispatchOptions } from 'svelte/internal';
    //
    import { pressWriter } from '../transitions/pressWriter';
    import { format } from '../utils/format';
    
    export let title: string = 'Enter what do you want to do:';
    export let buttonTitle: string = 'Go!';
    //console.log($$props);

    let text: string = '';
    let clicked: boolean = false;

    /**** onMount ****/

    let show = false;
    type FuncMount = () => () => void;
    //
    const mount: FuncMount = () => {
        show = true;
        return () => {}
    }

    onMount(mount);

    /**** ****/

    type DispatcherType = <EventKey extends string>(type: EventKey, detail?: any, options?: DispatchOptions) => boolean;
    const dispatch: DispatcherType = createEventDispatcher();

    function handleAddClick(ev: MouseEvent): void {
        clicked = !clicked;
        dispatch('addTodo', {text});
    }

    /*
    function handleTextInput(ev: Event) {
        text = (ev.target as HTMLInputElement).value;
    }
    */

    // Пример использования метода жизненного цикла tick()
    type SelectionType = {selectionStart: number, selectionEnd: number, value: string};
    //
    async function handleTextChange(ev: Event) {
        const {selectionStart, selectionEnd, value}: SelectionType = this as HTMLInputElement;
        text = format((ev.target as HTMLInputElement).value);

        await tick(); // Ждем пока обновится DOM. После устанавливаем курсор на место
        (this as HTMLInputElement).selectionStart = selectionStart;
        (this as HTMLInputElement).selectionEnd = selectionEnd;
    }
</script>

<div class="main-container" class:clicked={clicked}>
    {#if show}
        <label
            in:pressWriter="{{speed: 200}}"
            for="todo-text">{title}</label>
    {/if}
    <!-- Пример, для чего нужен метод tick() (в handleTextChange)
    <input class="todo-input" id="todo-text" value={text} on:input={handleTextChange} />
    -->
    <!-- Обработчик события handleTextInput можно заменить на bind:value
    <input class="todo-input" id="todo-text" on:input={handleTextInput} />
    -->
    <input class="todo-input" id="todo-text" bind:value={text} />
    <button on:click={handleAddClick}>{buttonTitle}</button>
</div>

<style>
    :global(label) {
        color: blueviolet;
    }

    .main-container {
        background-color: lightseagreen;
        border-radius: 5px;
        padding: 10px;
    }

    .clicked {
        background-color: coral;
    }

    .todo-input {
        width: 100%;
    }
</style>
