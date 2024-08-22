import React, { useRef, useState } from 'react';
import TodoItem from './TodoItem';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { boardState, editTodoState, TodoProps, todoState } from './atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  padding-top: 10px;
  background-color: lightblue;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<AreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? 'pink'
      : props.isDraggingFromThis
        ? '#fd688d'
        : '#c1a4db'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface BoardProps {
  boardId: string;
  boardList: TodoProps[];
}

interface AreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface FormProps {
  todo: string;
}

function Board({ boardId, boardList }: BoardProps) {
  const [todos, setTodos] = useRecoilState(boardState);
  const [onInputSpan, setOnInputSpan] = useRecoilState(todoState);
  const [isEditing, setEditing] = useRecoilState(editTodoState);
  const { register, setValue, handleSubmit } = useForm<FormProps>();
  // 새로운 투두 추가
  const onValid = ({ todo }: FormProps) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };
    setTodos((allboards) => {
      return {
        ...allboards,
        [boardId]: [...allboards[boardId], newTodo],
      };
    });
    setValue('todo', '');
  };
  // 투두 삭제
  const removeTodosHandler = (todoId: number) => {
    setTodos((todos) => {
      const copyBoard = boardList.filter((name) => name.id !== todoId);
      return {
        ...todos,
        [boardId]: copyBoard,
      };
    });
  };
  // TODO: 투두 수정
  const editedTodosHandler = (todoId: number) => {
    setTodos((allTodo) => {
      const edited = allTodo[boardId].map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            text: onInputSpan,
          };
        }
        return todo;
      });
      return { ...allTodo, [boardId]: edited };
    });
    setEditing(false);
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('todo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            {...provided.droppableProps}
          >
            {boardList.map((todoItem, index) => (
              <TodoItem
                key={todoItem.id}
                index={index}
                todoText={todoItem.text}
                todoId={todoItem.id}
                removeTodos={removeTodosHandler}
                editedTodos={editedTodosHandler}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
