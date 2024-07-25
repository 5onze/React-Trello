import { atom } from 'recoil';

export interface TodoProps {
  id: number;
  text: string;
  isComplete: boolean;
}

export const todoListState = atom<TodoProps[]>({
  key: 'todoListState',
  default: [],
});
