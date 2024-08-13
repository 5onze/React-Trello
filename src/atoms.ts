import { atom, DefaultValue, selector } from 'recoil';
import type { AtomEffect } from 'recoil';

export interface TodoProps {
  id: number;
  text: string;
}

export interface BoardProps {
  [key: string]: TodoProps[];
}

export const boardState = atom<BoardProps>({
  key: 'board',
  default: {
    Todo: [
      { text: 'hello', id: 1 },
      { text: 'todo', id: 2 },
    ],
    Doing: [],
    Done: [],
  },
});

const localStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const todoListState = atom<TodoProps[]>({
  key: 'todoListState',
  default: [],
  effects: [localStorageEffect('todoList')],
});

export const todoListFilterState = atom({
  key: 'todoListFilterState',
  default: 'Show All',
});
