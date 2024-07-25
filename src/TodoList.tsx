import React from 'react';
import { useRecoilValue } from 'recoil';
import { todoListState } from './atoms';
import TodoItemCreator from './TodoItemCreator';
import TodoItem from './TodoItem';

function TodoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      <TodoItemCreator />
      <p>
        {todoList.map((todoItem) => (
          <TodoItem key={todoItem.id} item={todoItem} />
        ))}
      </p>
    </>
  );
}

export default TodoList;
