import { writable } from 'svelte/store';
import type { Writable, Updater, Subscriber, Unsubscriber } from 'svelte/store';
import { v4 as uuid } from 'uuid';
//
import type { ITodo } from '../utils/getTodos';

type SubscribeType = (this: void, run: Subscriber<ITodo[]>, invalidate?: any) => Unsubscriber;
type SetType = (this: void, value: ITodo[]) => void;
type UpdateType = (this: void, updater: Updater<ITodo[]>) => void;

type InitType = (initialState: ITodo[]) => void;
type AddType = (itemText: string) => void;
type ToggleDoneType = (id: string, itemDone: boolean) => void;
type RemoveType = (id: string) => void

interface ITodoStore {
    subscribe: SubscribeType;
    set: SetType;
    update: UpdateType;
    //
    init: InitType;
    add: AddType;
    toggleDone: ToggleDoneType;
    remove: RemoveType;
}

function createTodoStore(): ITodoStore  {
    const store: Writable<ITodo[]> = writable([], () => {
        //console.log('subscribed');
        // Эта функция вызывается когда количество подписчиков станет = 0
        return () => {
            //console.log('subscribers = 0');
        }
    });

    const {subscribe, set, update}: {subscribe: SubscribeType, set: SetType, update: UpdateType} = store;

    return {
        subscribe,
        set,
        update,
        //
        init: (initialState: ITodo[]): void => {
            set(initialState);
        },
        add: (itemText: string): void => {
            const newItem: ITodo = {id: uuid(), text: itemText, done: false};
            update((state: ITodo[]): ITodo[] => {
                return [...state, newItem];
            });
        },
        toggleDone: (id: string, itemDone: boolean): void => {
            update((state: ITodo[]): ITodo[] => {
                return state.map((item: ITodo) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            done: itemDone
                        }
                    }
                    else {
                        return item;
                    }
                });
            });
        },
        remove: (id: string): void => {
            update((state: ITodo[]): ITodo[] => {
                return state.filter((item: ITodo) => {
                    return item.id !== id
                });
            });
        }
    }
}

export const todoItemsStore: ITodoStore = createTodoStore();
