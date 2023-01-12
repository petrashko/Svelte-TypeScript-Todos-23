<script lang="ts">
    import { onMount } from 'svelte';

    interface IReply {
        id: number;
        text: string;
    }

    let reply: number | null =  null; //3;
    const questionsReplies: IReply[] = [
        {id: 1, text: 'First reply'},
        {id: 2, text: 'Second reply'},
        {id: 3, text: 'Third reply'}
    ];

    let text = ''; //'Learn Svelte';
    const items: string[] = ['', 'Learn JS', 'Learn HTML', 'Learn CSS', 'Learn Svelte', 'Just Learn'];

    let example: HTMLDivElement;
    type MountType = () => () => void;
    const mount: MountType = () => {
        example.insertAdjacentHTML('beforeend', '<p>Добавлено через bind:this</p>')

        return () => {
            return;
        }
    }
    onMount(mount);
</script>

<div class="test-scss" bind:this={example}>
    <p class="test-scss-title">Choose correct one:</p>
    <div>
        {#each questionsReplies as quest, index (quest.id) }
            <label>
                <input type="radio" bind:group={reply} value={quest.id} />
                {quest.text}
            </label>
        {/each}
    </div>
    Reply: {reply}

    <div>
        <select bind:value={text}>
            {#each items as item (item)}
                <option value={item}>{item}</option>
            {/each}
        </select>
    </div>
    Selected: {text}
</div>

<style lang="scss">
    .test-scss {
        width: 100%;
        margin: 0 auto;

        &-title {
            color: #ff4444;
        }

        & div {
            border: 1px solid rgba(0, 0, 255, 0.4);
        }
    }
</style>