import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { filteredTodoListState, todoListState, TodoProps } from './atoms';
import TodoItemCreator from './TodoItemCreator';
import TodoItem from './TodoItem';
import TodoListFilters from './TodoListFilters';
import TodoListStats from './TodoListStats';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Board = styled.div`
  padding: 20px 10px;
  padding-top: 30px;
  background-color: lightgreen;
  border-radius: 5px;
  min-height: 200px;
`;

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
    <div>
      <TodoListStats />
      <TodoListFilters />
      <TodoItemCreator />
      <div>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <Board ref={provided.innerRef} {...provided.droppableProps}>
              {todoList?.map((todoItem, index) => (
                <TodoItem key={todoItem.id} item={todoItem} index={index} />
              ))}
              {provided.placeholder}
            </Board>
          )}
        </Droppable>
      </div>
    </div>
  );
}

export default TodoList;
