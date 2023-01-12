<script lang="ts">
    //import svelteLogo from './assets/svelte.svg';
    import { onMount, onDestroy, setContext } from 'svelte';
    import { linear } from 'svelte/easing';
    import { crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import type { Unsubscriber } from 'svelte/store';
    import type { TransitionConfig, CrossfadeParams } from 'svelte/transition';
    //
    import { isStringNotEmpty } from './utils/guards';
    //import { files } from './components/files';
    import { getTodos } from './utils/getTodos';
    import type { ITodo, IUser } from './utils/getTodos';
    //
    //import { todoItems } from './store/todoItems';
    import { todoItemsStore } from './store/todoItemsStore';
    import { todoStats, type ITodoStats } from './store/todoStats';
    import { mousePosition } from './store/mousePosition';
    //
    import BaseLyaout from './lyaouts/BaseLayout.svelte';
    import AddTodoItem from './components/AddTodoItem.svelte';
    import TodoItem from './components/TodoItem.svelte';
    import Examples from './components/Examples.svelte';
    //import Dir from './components/Dir.svelte';
    import Tabs from './components/tabs/Tabs.svelte';
    import BaseLayout from './lyaouts/BaseLayout.svelte';
    
    //export let name: string = '';
    
    //let items: ITodo[] = [];
    // Для блока {#await}
    //let itemsPromise: Promise<ITodo[]> = getTodos();
    let loadError: string | null = null;

    /**** Store ****/

     let stat: ITodoStats;
    const unSubStat: Unsubscriber = todoStats.subscribe((value: ITodoStats) => {stat = value});

    /**** Context ****/

    const user: IUser = {name: 'John'};
    setContext<IUser>('todo_user', user);

    /**** onMount ****/

    type FuncMount = () => () => void;
    //
    const mount: FuncMount = () => {
        /*
        getTodos().then((res: ITodo[]) => {
            todoItems.set(res);
        });
        */
        // Или через async / await
        const getData = async (): Promise<void> => {
            try {
                todoItemsStore.init( await getTodos() );
            }
            catch (err: any) {
                loadError = (err as Error).message;
            }
        }
        getData();
        
        // Вызывается когда компонент прекращает существовать.
        // Или
        // Вместо возврата функции можно вызвать ее в onDestroy.
        return () => {
            //todoItems.set([]);
            //unSubStat();
        }
    }

    onMount(mount);

    /**** onDestroy ****/ 

    type FuncDestroy = () => void;
    //
    const destroy: FuncDestroy = () => {
        () => {
            todoItemsStore.init([]);
            unSubStat();
        }
    }

    onDestroy(destroy);

    /**** Анимация перехода из одного списка в другой ****/

    type SendAndReceiveType = (node: Element, params: CrossfadeParams & {key: any}) => () => TransitionConfig;

    const [send, receive]: [send: SendAndReceiveType, receive: SendAndReceiveType] = crossfade({
        duration: 3000,
        // fallback выполняется если НЕ указано (откуда/куда) должен перейти элемент
        fallback(node, params) {
            const styles: CSSStyleDeclaration = getComputedStyle(node);
            const transform: string = styles.transform === 'none' ? '' : styles.transform;

            return {
                duration: 500,
                easing: linear,
                css: (t: number) => `transform: ${transform} scale(${t}); opasity: ${t};`
            }
        }
    });

    /**** ****/

    function handleAddClick(ev: CustomEvent<{text?: string}>): void {
        //console.log(ev.detail);
        const itemText: string | undefined = ev.detail?.text?.trim();
        if (!isStringNotEmpty(itemText)) {
            return;
        }

        // Теперь работаем со store
        //const newItem: ITodo = {id: uuid(), text: itemText, done: false};
        //items = [...items, newItem];
        todoItemsStore.add(itemText);
    }

    function handleDoneChange(id: string, detail: {done?: boolean}): void {
        if (typeof detail.done === 'undefined') {
            return;
        }

        todoItemsStore.toggleDone(id, detail.done);
    }

    function handleRemoveTodo(id: string): void {
        todoItemsStore.remove(id);
    }

    const handleKeydown = (ev: KeyboardEvent): void => {
        //console.log('===>', ev.key);
    }
    const handleMouseenter = (ev: MouseEvent): void => {
        //console.log('===>', ev);
    }


    /*
    let z: number;
    $: {
        if (items.length > 5) {
            console.log(items);
        }
        z = items.length;
    }
    $: len = items.length;
    */
</script>

<!--
<main>
    <h1>Hello {name}</h1>
    <p>
        <a href="https://svelte.dev" target="_blank" rel="noreferrer"> 
            <img src="/vite.svg" class="logo svelte" alt="Svelte Logo" />
            <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
        </a>
    </p>
</main>
-->

<svelte:window on:keydown={handleKeydown} />
<svelte:body on:mouseenter={handleMouseenter} />
<svelte:head>
    <title>Home page</title>
</svelte:head>

<div>
    x: {$mousePosition.x}; y: {$mousePosition.y}
</div>

<BaseLayout>
    <div slot="headerSlot" let:greeting>
        {greeting} and Welcome to Svelte app!
    </div>
    <div slot="footerSlot">
        <p class="footer-item">Thank you! :)</p>
    </div>

    <AddTodoItem
        on:addTodo={handleAddClick}
    />

    <div>
        Total todo: {stat.totalCount}; Done todo: {stat.doneCount}; Left todo: {stat.leftTodoCount}
    </div>

    <!--
    {#await itemsPromise}
        <p>Loading...</p>
    {:then _items}
        {#each _items as {id, text, done}, index (id)}
            <div class="todo-item-container">
                <TodoItem title={`${index+1}: ${text}`} bind:done={done}/>
            </div>
        {:else}
            <p>Not loaded</p>
        {/each}
    {:catch err}
        <p>{err.message}</p>
    {/await}
    -->

    <div class="todos-container">
        <!-- Список НЕ заверщенных todo -->
        <div class="todo-items-container">
            {#each $todoItemsStore.filter(item => !item.done) as {id, text, done}, index (id)}
                <!--
                    in:receive="{{key: id}}" и out:send="{{key: id}}"
                    применяются для всего содержимого div
                -->
                <div
                    class="todo-item-container"
                    in:receive="{{key: id}}"
                    out:send="{{key: id}}"
                    animate:flip="{{duration: 500}}"
                >
                    <!-- Работаем через bind
                    <TodoItem title={`${index+1}: ${text}`} bind:done={done}/>
                    -->
                    <TodoItem
                        title={`${index+1}: ${text}`}
                        done={done}
                        on:doneChange={(ev) => handleDoneChange(id, ev.detail)}
                        on:removeTodo={() => handleRemoveTodo(id)}
                    />
                </div>
            {:else}
                {#if loadError === null}
                    <p>No items yet</p>
                {:else}
                    <p>{loadError}</p>
                {/if}
            {/each}
        </div>

        <!-- Список заверщенных todo -->
        <div class="todo-items-container">
            {#each $todoItemsStore.filter(item => item.done) as {id, text, done}, index (id)}
                <!--
                    in:receive="{{key: id}}" и out:send="{{key: id}}"
                    применяются для всего содержимого div
                -->
                <div
                    class="todo-item-container"
                    in:receive="{{key: id}}"
                    out:send="{{key: id}}"
                    animate:flip="{{duration: 500}}"
                >
                    <!-- Работаем через bind
                    <TodoItem title={`${index+1}: ${text}`} bind:done={done}/>
                    -->
                    <TodoItem
                        title={`${index+1}: ${text}`}
                        done={done}
                        on:doneChange={(ev) => handleDoneChange(id, ev.detail)}
                        on:removeTodo={() => handleRemoveTodo(id)}
                    />
                </div>
            {:else}
                {#if loadError === null}
                    <p>No items yet</p>
                {:else}
                    <p>{loadError}</p>
                {/if}
            {/each}
        </div>
    </div>

    {#key $todoItemsStore}
        <div>Количество элементов: {$todoItemsStore.length}</div>
    {/key}
</BaseLayout>

<Examples />

<Tabs />

<!--
<Dir {files} name="root" />
-->

<style>
    .todo-item-container {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .todos-container {
        width: 100%;
        display: flex;
    }

    .todo-items-container {
        flex: 1;
        padding: 5px;
        box-sizing: border-box;
    }

    .footer-item {
        font-size: 24px;
        color: dimgray;
    }
</style>
