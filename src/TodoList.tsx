import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { filteredTodoListState, todoListState, TodoProps } from './atoms';
import TodoItemCreator from './TodoItemCreator';
import TodoItem from './TodoItem';
import TodoListFilters from './TodoListFilters';
import TodoListStats from './TodoListStats';

function TodoList() {
  const todoList = useRecoilValue(filteredTodoListState);
  const setTodoList = useSetRecoilState(todoListState);

  useEffect(() => {
    const savedValue = localStorage.getItem('todoList');

    if (savedValue) {
      const obj = JSON.parse(savedValue) as TodoProps[];
      setTodoList(obj);
    }
  }, [setTodoList]);

  return (
    <>
      <TodoListStats />
      <TodoListFilters />
      <TodoItemCreator />
      <ul>
        {todoList?.map((todoItem) => (
          <TodoItem key={todoItem.id} item={todoItem} />
        ))}
      </ul>
    </>
  );
}

export default TodoList;
