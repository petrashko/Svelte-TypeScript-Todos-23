import { v4 as uuid } from 'uuid';

export interface IUser {
    name: string;
}

export interface ITodo {
    id: string;
    text: string;
    done: boolean;
}

export function getTodos(): Promise<ITodo[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //reject(new Error('Ошибка Сервера'));
            resolve([
                {
                    id: uuid(),
                    text: 'Todo item 1 from server',
                    done: false
                },
                {
                    id: uuid(),
                    text: 'Todo item 2 from server',
                    done: true
                },
                {
                    id: uuid(),
                    text: 'Todo item 3 from server',
                    done: false
                }
            ]);
        }, 3000);
    });
}