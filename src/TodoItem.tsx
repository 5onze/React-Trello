import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { editTodoState, todoState } from './atoms';

const TodoBox = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const Card = styled.div<{ isDragging: boolean }>`
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  background-color: ${(props) => (props.isDragging ? '#fbfd90' : '#ffffff')};
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.05)' : 'none'};
  gap: 5px;
  div {
    outline: none;
    padding: 1px 0;
    display: flex;
    flex: 1 auto;
    align-items: center;
  }
  display: flex;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #ffffff9d;
  border-radius: 5px;
`;
interface TodoItemProps {
  todoText: string;
  todoId: number;
  index: number;
  removeTodos(todoId: number): void;
  editedTodos(todoId: number): void;
}

function TodoItem({
  todoText,
  todoId,
  index,
  removeTodos,
  editedTodos,
}: TodoItemProps) {
  const [isEditing, setEditing] = useRecoilState(editTodoState);

  return (
    <Draggable key={todoId} draggableId={todoId + ''} index={index}>
      {(provided, snapshot) => (
        <TodoBox
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Card isDragging={snapshot.isDragging}>
            <div>{todoText}</div>
            <Button onClick={() => editedTodos(todoId)}>수정</Button>
            <Button onClick={() => removeTodos(todoId)}>X</Button>
          </Card>
        </TodoBox>
      )}
    </Draggable>
  );
}

export default React.memo(TodoItem);
