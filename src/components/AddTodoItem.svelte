<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    //import { createEventDispatcher } from 'svelte';
    //
    import Form from './Form.svelte';
    //
    //console.log($$props);

    const props: {title?: string, buttonTitle: string} = {
        //title: 'What to do?',
        buttonTitle: 'Add todo'
    }

    /**** onMount ****/ 
    
    let counter: number = 0;
    let interval: NodeJS.Timer;

    type FuncMount = () => () => void;
    //
    const mount: FuncMount = () => {
        interval = setInterval(() => { counter++; }, 1000);

        // Вызывается когда компонент прекращает существовать.
        // Или
        // Вместо возврата функции можно вызвать ее в onDestroy.
        return () => {
            clearInterval(interval);
        }
    }

    //onMount(mount);

    /**** onDestroy ****/ 

    type FuncDestroy = () => void;
    //
    const destroy: FuncDestroy = () => {
        () => {
            //clearInterval(interval);
        }
    }

    onDestroy(destroy);

    /**** ****/
    
    /* Лишний код!!! on:addTodo работает БЕЗ этого
    const dispatch = createEventDispatcher();

    function handleAddItem(ev: CustomEvent<{text?: string}>): void {
        dispatch('addTodo', ev.detail);
    }
    */
</script>

{counter}
<!-- on:addTodo: Пробросить кастомное событие из дочернего компонента в родительский -->
<Form
    {...props}
    on:addTodo
/>

<style></style>
