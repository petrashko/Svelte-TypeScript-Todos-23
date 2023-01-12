import { derived } from 'svelte/store';
import type { Readable, StartStopNotifier, Subscriber, Unsubscriber } from 'svelte/store';
//
import { todoItemsStore } from './todoItemsStore';
import type { ITodo } from '../utils/getTodos';

export interface ITodoStats {
    doneCount: number,
    totalCount: number,
    leftTodoCount: number
}

type CallbackType = (stores: [ITodo[]]) => ITodoStats;

const cb: CallbackType = ([todoItemsStore]): ITodoStats => {
    const doneCount: number = todoItemsStore.filter((item: ITodo) => item.done).length;
    const totalCount: number = todoItemsStore.length;

    return {
        doneCount,
        totalCount,
        leftTodoCount: totalCount - doneCount
    }
}

export const todoStats: Readable<ITodoStats> = derived([todoItemsStore], cb);