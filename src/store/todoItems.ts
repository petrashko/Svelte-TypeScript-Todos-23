import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
//
import type { ITodo } from '../utils/getTodos';

export const todoItems: Writable<ITodo[]> = writable([], () => {
    //console.log('subscribed');
    // Эта функция вызывается когда количество подписчиков станет = 0
    return () => {
        //console.log('subscribers = 0');
    }
});
