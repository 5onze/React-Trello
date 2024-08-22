import { atom, DefaultValue, selector } from 'recoil';
import type { AtomEffect } from 'recoil';

export interface TodoProps {
  id: number;
  text: string;
}

export interface BoardProps {
  [key: string]: TodoProps[];
}

// 보드와 모든 투두
export const boardState = atom<BoardProps>({
  key: 'board',
  default: {
    Todo: [],
    Doing: [],
    Done: [],
  },
});

// 투두 업데이트
export const todoState = atom({
  key: 'todoText',
  default: '',
});

// 투두 수정
export const editTodoState = atom({
  key: 'todoEdit',
  default: false,
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
