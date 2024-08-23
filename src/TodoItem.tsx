import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  boardState,
  editTodoState,
  todoIdState,
  TodoProps,
  todoTextState,
} from './atoms';
import { useForm } from 'react-hook-form';

const Card = styled.div<{ isDragging: boolean; isEditMod: boolean }>`
  width: 100%;

  border-radius: 5px;
  padding: 10px;
  background-color: ${(props) => (props.isDragging ? '#fbfd90' : '#ffffff')};
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.05)' : 'none'};
  gap: 5px;
  form,
  div {
    display: flex;
    outline: none;
    padding: 1px 0;
    align-items: center;
  }
  input {
    border: ${(props) => (props.isEditMod ? 'solid 1px' : 'none')};
    width: 100%;
  }
`;

const InputBox = styled.div`
  flex: 1 auto;
`;

const Button = styled.button`
  width: 40px;
  display: flex;
  padding: 5px;
  background-color: #ffffff9d;
  border-radius: 5px;
`;
interface TodoItemProps {
  todoText: string;
  todoId: number;
  index: number;
  removeTodos(todoId: number): void;
}

interface FormProps {
  inputValue: string;
}

function TodoItem({ todoText, todoId, index, removeTodos }: TodoItemProps) {
  const [todos, setTodos] = useRecoilState(boardState);
  const [isEditing, setEditing] = useRecoilState(editTodoState);

  // todoId, todoText state
  const [editingTodoId, setEditingTodoId] = useRecoilState(todoIdState);
  const [inputValue, setInputValue] = useRecoilState(todoTextState);
  // Form 이벤트
  const { register, setValue, handleSubmit } = useForm<FormProps>();

  // TODO: 수정 후 저장하면 input value 반영되게 하기
  // 투두 수정 구현하기

  // https://velog.io/@hamham/%ED%88%AC%EB%91%90%EB%A6%AC%EC%8A%A4%ED%8A%B8-6%ED%83%84-%EC%88%98%EC%A0%95-%EA%B8%B0%EB%8A%A5-%EB%A7%8C%EB%93%A4%EA%B8%B0
  // https://github.com/jiwonmik/Drag-and-Drop-Boards/blob/main/src/components/Board/DraggableBoard.tsx
  // 오류 : Cannot read properties of undefined (reading 'map')

  // form
  /*  const editedTodos = ({ inputValue }: FormProps) => {
    if (inputValue === '') {
      return;
    }
    setTodos((allTodo) => {
      const edited = allTodo[index].map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            text: inputValue,
          };
        }
        return todo;
      });
      setEditing(false);
      return { ...allTodo, [index]: edited };
    });
    setValue('inputValue', '');
  }; */

  /*  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          } */

  const editedTodos = () => {};

  // 템플릿
  const editingTemplate = (
    <form onSubmit={handleSubmit(editedTodos)}>
      <InputBox>
        <input type="text" {...register('inputValue', { required: true })} />
      </InputBox>
      <div>
        <Button type="button" onClick={() => setEditing(false)}>
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div>
      <InputBox>{todoText}</InputBox>
      <div>
        <Button onClick={() => setEditing(true)}>편집</Button>
        <Button onClick={() => removeTodos(todoId)}>삭제</Button>
      </div>
    </div>
  );

  return (
    <Draggable key={todoId} draggableId={todoId + ''} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          isEditMod={isEditing}
        >
          {isEditing ? editingTemplate : viewTemplate}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(TodoItem);
