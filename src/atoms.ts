import { atom, DefaultValue, selector } from 'recoil';
import type { AtomEffect } from 'recoil';

export interface TodoProps {
  id: number;
  text: string;
}

export interface BoardProps {
  id: number;
  items: TodoProps[];
  boardName: string;
}

// 보드와 모든 투두
export const boardState = atom<BoardProps[]>({
  key: 'board',
  default: [
    {
      id: 0,
      boardName: 'Todo',
      items: [{ id: 3, text: '새로운 할일' }],
    },
    {
      id: 1,
      boardName: 'Doing',
      items: [],
    },
    {
      id: 2,
      boardName: 'Done',
      items: [{ id: 6, text: '투두 삭제 구현' }],
    },
  ],
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
