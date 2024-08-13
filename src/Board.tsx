import React, { useRef } from 'react';
import TodoItem from './TodoItem';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { boardState, TodoProps } from './atoms';
import { useSetRecoilState } from 'recoil';

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
  const setTodos = useSetRecoilState(boardState);
  const { register, setValue, handleSubmit } = useForm<FormProps>();
  const onValid = ({ todo }: FormProps) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };
    console.log(todo, newTodo);
    setTodos((allboards) => {
      return {
        ...allboards,
        [boardId]: [...allboards[boardId], newTodo],
      };
    });
    setValue('todo', '');
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
